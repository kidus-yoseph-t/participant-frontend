import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { ParticipantsModel } from '../models/participants.model';

interface ParticipantsResponse {
  success: boolean;
  institutions: ParticipantsModel[];
}

interface CreateResponse {
  id?: number;
  institution?: { id?: number };
  data?: { id?: number };
}

@Service()
export class ParticipantService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/participants';
  private readonly logoBaseUrl = 'http://localhost:9081/uploads/logos/';

  private readonly participants = signal<ParticipantsModel[]>([]);

  getParticipants() {
    return this.participants.asReadonly();
  }

  private fetchAll(): Observable<ParticipantsModel[]> {
    return this.http.get<ParticipantsResponse>(this.baseUrl).pipe(
      map(res => res.institutions ?? []),
      tap(list => this.participants.set(list))
    );
  }

  // GET /api/v1/participants
  load(): void {

    this.fetchAll().subscribe({ error: () => {} });
  }

  getById(id: number): Observable<ParticipantsModel | undefined> {
    const cached = this.participants().find(p => p.id === id);
    if (cached) return of(cached);

    return this.fetchAll().pipe(
      map(list => list.find(p => p.id === id)),
      catchError(() => of(undefined))
    );
  }

  // POST /api/v1/participants
  addParticipants(data: Omit<ParticipantsModel, 'id'>): Observable<number | undefined> {
    return this.http.post<CreateResponse>(this.baseUrl, data).pipe(
      switchMap(res => {
        const id = res?.id ?? res?.institution?.id ?? res?.data?.id;
        if (id !== undefined) return of(id);
        return this.fetchAll().pipe(map(list => list.find(p => p.bic === data.bic)?.id));
      })
    );
  }

  // PUT /api/v1/participants/{id}
  updateParticipant(id: number, data: Omit<ParticipantsModel, 'id'>): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // DELETE /api/v1/participants/{id}
  deleteParticipant(id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.participants.update(list => list.filter(p => p.id !== id)))
    );
  }

  // POST /api/v1/participants/{id}/logo (multipart/form-data)
  uploadLogo(id: number, file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('logo', file); 
    return this.http.post(`${this.baseUrl}/${id}/logo`, formData);
  }

 logoUrl(p: ParticipantsModel): string | null {
  if (!p.logoPath) return null;
  if (/^https?:\/\//.test(p.logoPath)) return p.logoPath;

  const fileName = p.logoPath.split(/[\\/]/).pop(); 
  return fileName ? `${this.logoBaseUrl}${encodeURIComponent(fileName)}` : null;
}
}
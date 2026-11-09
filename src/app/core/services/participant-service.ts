import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ParticipantsModel } from '../models/participants.model';

interface ParticipantsResponse {
  success: boolean;
  institutions: ParticipantsModel[];
}

@Service()
export class ParticipantService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/participants';

  private readonly participants = signal<ParticipantsModel[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  getParticipants() {
    return this.participants.asReadonly();
  }

  // GET /api/v1/participants
  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.http.get<ParticipantsResponse>(this.baseUrl).subscribe({
      next: res => {
      if (!res.success) {
        this.error.set('The server could not return participants.');
      } else {
        this.participants.set(res.institutions ?? []);
      }
      this.loading.set(false);
      },
      error: () => {
        this.error.set(`Could not load participants.` );
        this.loading.set(false);
      },
    });
  }

  getById(id: number): Observable<ParticipantsModel | undefined> {
    const cached = this.participants().find(p => p.id === id);
    if (cached) return of(cached);

    return this.http.get<ParticipantsResponse>(this.baseUrl).pipe(
      tap(res => this.participants.set(res.institutions ?? [])),
      map(res => res.institutions?.find(p => p.id === id)),
      catchError(() => of(undefined))
    );
  }

  // POST /api/v1/participants
  addParticipants(data: Omit<ParticipantsModel, 'id'>): Observable<unknown> {
    return this.http.post(this.baseUrl, data);
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
}
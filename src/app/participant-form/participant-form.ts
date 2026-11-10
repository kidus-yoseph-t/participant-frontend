import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, tap, throwError } from 'rxjs';
import { ParticipantsModel } from '../core/models/participants.model';
import { ParticipantService } from '../core/services/participant-service';
import { NotificationServices } from '../core/services/notification-services';
import { TopNavigationBar } from '../layouts/top-navigation-bar/top-navigation-bar';

@Component({
  imports: [ReactiveFormsModule, TopNavigationBar],
  selector: 'app-participant-form',
  templateUrl: './participant-form.html',
})
export class ParticipantForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private participantService = inject(ParticipantService);
  private notify = inject(NotificationServices);

  private readonly maxFileSize = 1024 * 1024; 
  private existingLogoUrl: string | null = null;
  selectedFile: File | null = null;

  editId: number | null = null;
  saving = signal(false);
  previewUrl = signal<string | null>(null);
  fileError = signal('');

  get isEdit(): boolean {
    return this.editId !== null;
  }

  addForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    bic: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(11),
      Validators.pattern(/^[A-Za-z0-9]+$/),
    ]],
    shortname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    status: ['ACTIVE' as ParticipantsModel['status'], [Validators.required]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === null) return;

    const id = Number(idParam);
    if (!Number.isInteger(id)) {
      this.notFound();
      return;
    }

    this.participantService.getById(id).subscribe(participant => {
      if (!participant) {
        this.notFound();
        return;
      }
      this.editId = id;
      this.addForm.patchValue({
        name: participant.name,
        bic: participant.bic,
        shortname: participant.shortName,
        email: participant.email,
        phone: participant.phoneNumber,
        status: participant.status,
      });
      this.existingLogoUrl = this.participantService.logoUrl(participant);
      this.previewUrl.set(this.existingLogoUrl);
    });
  }

  private notFound(): void {
    this.notify.error('Participant not found.');
    this.router.navigate(['/participants']);
  }

  isInvalid(field: string): boolean {
    const control = this.addForm.get(field);
    return !!control && control.touched && control.invalid;
  }

  showError(field: string, error: string): boolean {
    const control = this.addForm.get(field);
    return !!control && control.touched && control.hasError(error);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.fileError.set('');
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.rejectFile(input, 'Only PNG or JPG images are allowed.');
      return;
    }
    if (file.size > this.maxFileSize) {
      this.rejectFile(input, 'The image must be 1 MB or smaller.');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  private rejectFile(input: HTMLInputElement, message: string): void {
    input.value = '';
    this.selectedFile = null;
    this.previewUrl.set(this.existingLogoUrl);
    this.fileError.set(message);
  }

  submit(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const data = this.addForm.getRawValue();
    const payload = {
      name: data.name.trim(),
      bic: data.bic.trim().toUpperCase(),
      shortName: data.shortname.trim(),
      email: data.email.trim(),
      phoneNumber: data.phone.trim(),
      status: data.status,
    };

    const file = this.selectedFile;
    const editId = this.editId;
    this.saving.set(true);

    const save$ = editId !== null
      ? this.participantService.updateParticipant(editId, payload).pipe(
          switchMap(() => (file ? this.participantService.uploadLogo(editId, file) : of(null)))
        )
      : this.participantService.addParticipants(payload).pipe(
          tap(newId => {
            if (newId !== undefined) this.editId = newId;
          }),
          switchMap(newId => {
            if (!file) return of(null);
            if (newId === undefined) return throwError(() => new Error('Missing id for logo upload'));
            return this.participantService.uploadLogo(newId, file);
          })
        );

    save$.subscribe({
      next: () => {
        this.notify.success(
          editId !== null ? 'Participant updated successfully.' : 'Participant saved successfully.'
        );
        this.router.navigate(['/participants']);
      },
      error: err => {
        if (!(err instanceof HttpErrorResponse)) {
          this.notify.error('The bank was saved, but its logo could not be uploaded.');
        }
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/participants']);
  }
}
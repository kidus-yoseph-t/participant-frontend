import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantsModel } from '../core/models/participants.model';
import { ParticipantService } from '../core/services/participant-service';
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

  editId: number | null = null;
  saving = signal(false);
  serverError = signal('');

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
    if (idParam === null) return;                       // no :id in the URL, so add mode

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
    });
  }

  private notFound(): void {
    alert('Participant not found.');
    this.router.navigate(['/participants']);
  }
  isInvalid(field: string): boolean {
    const control = this.addForm.get(field);
    return !!control && control.touched && control.invalid;
  }
  hasError(field: string, error: string): boolean {
    const control = this.addForm.get(field);
    return !!control && control.touched && control.hasError(error);
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

    this.saving.set(true);
    this.serverError.set('');

    const request$ = this.editId !== null
      ? this.participantService.updateParticipant(this.editId, payload)
      : this.participantService.addParticipants(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/participants']),
      error: () => {
        this.serverError.set('Could not save. Please check the data and try again.');
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/participants']);
  }
}
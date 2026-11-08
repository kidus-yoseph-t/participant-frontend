import { Component, inject, OnInit } from '@angular/core';
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
    const participant = Number.isInteger(id)
      ? this.participantService.getById(id)
      : undefined;

    if (!participant) {
      alert('Participant not found.');
      this.router.navigate(['/participants']);
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
  }

  // Red border: invalid AND touched
  isInvalid(field: string): boolean {
    const control = this.addForm.get(field);
    return !!control && control.touched && control.invalid;
  }

  // Specific message: this exact error AND touched
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

    if (this.editId !== null) {
      this.participantService.updateParticipant(this.editId, payload);
    } else {
      this.participantService.addParticipants(payload);
    }
    this.router.navigate(['/participants']);
  }

  cancel(): void {
    this.router.navigate(['/participants']);
  }
}
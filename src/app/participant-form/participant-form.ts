import { Component, inject } from '@angular/core';
import { ParticipantsModel } from '../core/models/participants.model';
import { ParticipantService } from '../core/services/participant-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TopNavigationBar } from '../layouts/top-navigation-bar/top-navigation-bar';
@Component({
  imports: [ReactiveFormsModule, TopNavigationBar],
  selector: 'app-participant-form',
  styleUrl: './participant-form.css',
  templateUrl: './participant-form.html',
})
export class ParticipantForm {

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private participantService = inject(ParticipantService);

 
  addForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    bic: ['', [Validators.required]],
    shortname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    status: ['ACTIVE' as ParticipantsModel['status'], Validators.required]
  })

  isInvalid(field: string){
    const data = this.addForm.get(field);
    return !!data && data.touched && data.invalid
  }
  submit(){
    if(this.addForm.invalid){
      this.addForm.markAllAsTouched;
      console.log("hi")
      return;
      
    }
      const data = this.addForm.getRawValue();
      this.participantService.addParticipants({
      name: data.name.trim(),
      bic: data.bic.trim(),
      shortName: data.shortname.trim(),
      email: data.email.trim(),
      phoneNumber: data.phone.trim(),
      status: data.status,
     })
    console.log('it reaches here')
    this.router.navigate(['/participants']);
    console.log('and reaches here')
  }

  cancel(){
    this.router.navigate(['/participants']);
  }
}

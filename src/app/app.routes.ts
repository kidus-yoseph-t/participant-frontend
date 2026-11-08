import { Routes } from '@angular/router';
import { Login } from './login/login'
import { Participants } from './participants/participants'
import { NotFound } from './not-found/not-found';
import { ParticipantForm } from './participant-form/participant-form';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'Login',
        pathMatch: 'full'
    },
    {
        path: 'Login',
        component: Login,
        title: 'Login'
    },
    {
        path: 'participants',
        component: Participants,
        title: 'participants'
    },
    {
        path:'participants/new',
        component: ParticipantForm,
        title: 'participants'
    },
    {
        path: 'participants/edit/:id',
        component: ParticipantForm 
    },
    {
        path: '**',
        component: NotFound,
        title: 'Not Found'
    }

];

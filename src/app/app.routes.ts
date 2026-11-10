import { Routes } from '@angular/router';
import { Login } from './login/login'
import { Participants } from './participants/participants'
import { NotFound } from './not-found/not-found';
import { ParticipantForm } from './participant-form/participant-form';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        title: 'Login'
    },

    {
        path: 'participants',
        canActivate: [authGuard],
        children: [
        { path: '', component: Participants, title: 'Participants' },
        { path: 'new', component: ParticipantForm },
        { path: 'edit/:id', component: ParticipantForm},
        ],
    },
    {
        path: '**',
        component: NotFound,
        title: 'Not Found'
    }

];

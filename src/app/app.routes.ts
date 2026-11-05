import { Routes } from '@angular/router';
import { Login } from './login/login'
import {Participants } from './participants/participants'
import { NotFound } from './not-found/not-found';

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
        path: '**',
        component: NotFound,
        title: 'Not Found'
    }

];

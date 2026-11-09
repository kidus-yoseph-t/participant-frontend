import { Service, signal } from '@angular/core';
import { ToastMessage, ToastType } from '../models/toast.model';

@Service()
export class NotificationServices {
    private nextId = 0;
    readonly toasts = signal<ToastMessage[]>([]);

    success(message: string){
        this.show('success', message);
    }
    error(message: string){
        this.show('danger', message);
    }

    dismiss(id: number){
        this.toasts.update(list => list.filter(t=> t.id !== id))
    }

     private show(type: ToastType, message: string): void {
        const id = ++this.nextId;
        this.toasts.update(list => [...list, { id, type, message }]);
        setTimeout(() => this.dismiss(id), 4000);
    }
}


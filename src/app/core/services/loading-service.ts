import { Service, computed, signal } from '@angular/core';

@Service()
export class LoadingService {
    private readonly pending = signal(0);
    readonly loading = computed(() => this.pending() > 0)
    show(){
        this.pending.update(p => p + 1)
    }
    hide(){
        this.pending.update(p => p - 1)
    }
}

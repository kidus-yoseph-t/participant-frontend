import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopNavigationBar } from '../layouts/top-navigation-bar/top-navigation-bar';
import { ConfirmModal } from '../shared/confirm-modal/confirm-modal';
import { ParticipantService } from '../core/services/participant-service';
import { NotificationServices } from '../core/services/notification-services';
import { ParticipantsModel } from '../core/models/participants.model';

@Component({
  imports: [TopNavigationBar, RouterLink, ConfirmModal],
  selector: 'app-participants',
  templateUrl: './participants.html',
})
export class Participants implements OnInit {
  private participantService = inject(ParticipantService);
  private notify = inject(NotificationServices);
  private participants = this.participantService.getParticipants();

  error = this.participantService.error;
  searchTerm = signal('');

  pendingDelete = signal<ParticipantsModel | null>(null);

  deleteMessage = computed(() => {
    const p = this.pendingDelete();
    return p
      ? `Are you sure you want to delete this bank? "${p.name}" will be removed permanently.`
      : '';
  });

  filteredParticipants = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const all = this.participants();

    return term
      ? all.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.bic.toLowerCase().includes(term))
      : all;

    // return [...matches].sort((a, b) => a.name.localeCompare(b.name));
  });

  total = computed(() => this.participants().length);

  ngOnInit(): void {
    this.participantService.load();
  }

  askDelete(p: ParticipantsModel): void {
    this.pendingDelete.set(p);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const p = this.pendingDelete();
    if (!p) return;
    this.pendingDelete.set(null);

    this.participantService.deleteParticipant(p.id).subscribe({
      next: () => this.notify.success(`"${p.name}" was deleted successfully.`),
      error: () => this.notify.error('Could not delete the participant. Please try again.'),
    });
  }
}
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopNavigationBar } from '../layouts/top-navigation-bar/top-navigation-bar';
import { ParticipantService } from '../core/services/participant-service';
import { ParticipantsModel } from '../core/models/participants.model';

@Component({
  imports: [TopNavigationBar, RouterLink],
  selector: 'app-participants',
  templateUrl: './participants.html',
})
export class Participants implements OnInit {
  private participantService = inject(ParticipantService);
  private participants = this.participantService.getParticipants();

  loading = this.participantService.loading;
  error = this.participantService.error;
  searchTerm = signal('');

  filteredParticipants = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const all = this.participants();

    const matches = term
      ? all.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.bic.toLowerCase().includes(term))
      : all;

    // return [...matches].sort((a, b) => a.name.localeCompare(b.name)); // for sorting
    return matches;
  });

  total = computed(() => this.participants().length);

  ngOnInit(): void {
    this.participantService.load();
  }

  remove(p: ParticipantsModel): void {
    if (!confirm(`Delete ${p.name}?`)) return;
    this.participantService.deleteParticipant(p.id).subscribe({
      error: () => alert('Could not delete the participant.'),
    });
  }
}
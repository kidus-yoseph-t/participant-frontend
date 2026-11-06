import { Component, computed, signal} from '@angular/core';
import { TopNavigationBar } from '../layouts/top-navigation-bar/top-navigation-bar';
import { ParticipantService } from '../core/services/participant-service';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [TopNavigationBar, RouterLink],
  selector: 'app-participants',
  styleUrl: './participants.css',
  templateUrl: './participants.html',
})
export class Participants {

  private participantService = inject(ParticipantService) 
  
  searchTerm = signal('');

 filteredParticipants = computed(() => {
  const term = this.searchTerm().trim().toLowerCase();
  const participants = this.participantService.getParticipants()(); 

  if (!term) return participants;
  
  // sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  
  return participants.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.bic.toLowerCase().includes(term)
  );
});
  total = computed(() => this.participantService.getParticipants()().length)

  onSearch(event: Event){
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}

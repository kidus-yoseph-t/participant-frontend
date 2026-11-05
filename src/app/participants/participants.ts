import { Component, computed, signal} from '@angular/core';
import { TopNavigationBar } from '../layouts/top-navigation-bar/top-navigation-bar';
import {ParticipantsModel} from '../core/models/participants.model';

@Component({
  imports: [TopNavigationBar],
  selector: 'app-participants',
  styleUrl: './participants.css',
  templateUrl: './participants.html',
})
export class Participants {
  participants: ParticipantsModel[] = [
    {
    id: 1,
    name: 'Abay Bank',
    bic: 'ABAYETAA',
    shortName: 'AB',
    email: 'abayBank@gmail.com',
    phoneNumber: '+251 11 123 4567',
    status: 'ACTIVE'
  },
    {
    id: 2,
    name: 'Bank of Abyssinia',
    bic: 'ABYSETAA',
    shortName: 'BA',
    email: 'abyssiniaBank@gmail.com',
    phoneNumber: '+251 11 987 6543',
    status: 'ACTIVE'
  },
    {
    id: 3,
    name: 'Commercial Bank of Ethiopia',
    bic: 'CBETETAA',
    shortName: 'CBE',
    email: 'commercialBank@gmail.com',
    phoneNumber: '+251 11 456 7890',
    status: 'INACTIVE'
  },
    {
    id: 4,
    name: 'Hibret Bank',
    bic: 'UNTDETAA',
    shortName: 'HB',
    email: 'hibretBank@gmail.com',
    phoneNumber: '+251 11 321 6549',
    status: 'ACTIVE'
  },
    {
    id: 5,
    name: 'Zemen Bank',
    bic: 'ZEMEETAA',
    shortName: 'ZB',
    email: 'zemenBank@gmail.com',
    phoneNumber: '+251 11 654 3210',
    status: 'ACTIVE'
  }
]
  searchTerm = signal('');

  filteredParticipants = computed(() =>{
    const term = this.searchTerm().trim().toLowerCase();
    if(!term) return this.participants;
    return this.participants.
    filter(p => p.name.toLowerCase().includes(term)
    || p.bic.toLowerCase().includes(term));
  })

  onSearch(event: Event){
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}

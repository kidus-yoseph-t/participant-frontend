import { Service, signal } from '@angular/core';
import { ParticipantsModel } from '../models/participants.model';

@Service()
export class ParticipantService {
  private readonly participants = signal<ParticipantsModel[]>([
    {
      id: 1,
      name: 'Abay Bank',
      bic: 'ABAYETAA',
      shortName: 'AB',
      email: 'abayBank@gmail.com',
      phoneNumber: '+251 11 123 4567',
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'Bank of Abyssinia',
      bic: 'ABYSETAA',
      shortName: 'BA',
      email: 'abyssiniaBank@gmail.com',
      phoneNumber: '+251 11 987 6543',
      status: 'ACTIVE',
    },
    {
      id: 3,
      name: 'Commercial Bank of Ethiopia',
      bic: 'CBETETAA',
      shortName: 'CBE',
      email: 'commercialBank@gmail.com',
      phoneNumber: '+251 11 456 7890',
      status: 'INACTIVE',
    },
    {
      id: 4,
      name: 'Hibret Bank',
      bic: 'UNTDETAA',
      shortName: 'HB',
      email: 'hibretBank@gmail.com',
      phoneNumber: '+251 11 321 6549',
      status: 'ACTIVE',
    },
    {
      id: 5,
      name: 'Zemen Bank',
      bic: 'ZEMEETAA',
      shortName: 'ZB',
      email: 'zemenBank@gmail.com',
      phoneNumber: '+251 11 654 3210',
      status: 'ACTIVE',
    },
  ]);

  // Read-only signal: components can read the list but can't replace it
  getParticipants() {
    return this.participants.asReadonly();
  }

  getById(id: number): ParticipantsModel | undefined {
    return this.participants().find(p => p.id === id);
  }

  addParticipants(data: Omit<ParticipantsModel, 'id'>): void {
    const nextId = Math.max(0, ...this.participants().map(p => p.id)) + 1;
    this.participants.update(list => [...list, { id: nextId, ...data }]);
  }

  updateParticipant(id: number, data: Omit<ParticipantsModel, 'id'>): void {
    this.participants.update(list =>
      list.map(p => (p.id === id ? { id, ...data } : p))
    );
  }
}
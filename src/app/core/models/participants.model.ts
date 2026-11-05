export interface ParticipantsModel {
    id: number;
    name: string;
    bic: string;
    shortName: string;
    email: string;
    phoneNumber: string;
    status: 'ACTIVE' | 'INACTIVE';
}

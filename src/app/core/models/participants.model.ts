export interface ParticipantsModel {
    id?: number;
    name: string;
    bic: string;
    shortName: string;
    address?: string;
    email: string;
    phoneNumber?: string;
    logoPath?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

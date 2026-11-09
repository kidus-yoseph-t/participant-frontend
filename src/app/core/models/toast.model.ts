export type ToastType = 'success' | 'danger';

export interface ToastMessage{
    id: number;
    type: ToastType;
    message: string;
}
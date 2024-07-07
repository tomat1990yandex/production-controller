export type CardStatus = 'green' | 'yellow' | 'red';

export interface CardType {
    id: number;
    title: string;
    status: CardStatus;
    text: string;
    isEditing: boolean;
}

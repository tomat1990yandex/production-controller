export type CardStatus = 'green' | 'yellow' | 'red';

export interface GroupType {
  _id: string;
  groupName: string;
}

export interface CardType {
  _id?: string;
  title: string;
  status: CardStatus;
  text: string;
  group: string;
}

export type CardStatus = 'green' | 'yellow' | 'red';

export interface GroupType {
  _id: number;
  groupName: string;
}

export interface CardType {
  _id?: number;
  title: string;
  status: CardStatus;
  text: string;
  group: GroupType;
}

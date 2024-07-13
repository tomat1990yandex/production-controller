import mongoose, { Schema, Document } from 'mongoose';

export type CardStatus = 'green' | 'yellow' | 'red';

export interface ICard extends Document {
    title: string;
    status: CardStatus;
    text: string;
    group: string;
}

const CardSchema: Schema = new Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['green', 'yellow', 'red'], default: 'green' },
    text: { type: String, default: '' },
    group: { type: String, required: true }
});

export const Card = mongoose.model<ICard>('Card', CardSchema);

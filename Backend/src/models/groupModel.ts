import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
    groupName: string;
}

const GroupSchema: Schema = new Schema({
    groupName: { type: String, required: true, unique: true },
});

export const Group = mongoose.model<IGroup>('Group', GroupSchema);

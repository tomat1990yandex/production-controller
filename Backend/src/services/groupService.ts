import { Group, IGroup } from "../models/groupModel";

export const findAllGroups = async (): Promise<IGroup[]> => {
    return Group.find();
};

export const createGroup = async (group: Partial<IGroup>): Promise<IGroup> => {
    return Group.create(group);
};

export const updateGroup = async (id: string, group: Partial<IGroup>): Promise<IGroup | null> => {
    return Group.findByIdAndUpdate(id, group, { new: true });
};

export const deleteGroup = async (id: string): Promise<IGroup | null> => {
    return Group.findByIdAndDelete(id);
};

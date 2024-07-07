import { User, IUser } from '../models/userModel';

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
    return User.findOne({ username });
};

export const createUser = async (user: Partial<IUser>): Promise<IUser> => {
    return User.create(user);
};

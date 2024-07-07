import { Request, Response } from 'express';
import { createUser, findUserByUsername } from '../services/userService';
import { sign } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await createUser({ username, password });

        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '8h'
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

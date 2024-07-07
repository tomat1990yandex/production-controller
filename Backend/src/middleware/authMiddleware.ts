import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        res.locals.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};

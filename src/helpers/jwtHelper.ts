// authMiddleware.js
import jwt,  {JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserType } from '../controller/loginController';
import { Request, Response, NextFunction } from 'express';
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

let refreshTokens:string[] = []; // In-memory storage for refresh tokens


declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string; // Modify the type based on how you handle JWT payloads
        }
    }
}


// Generate Access Token
export const generateAccessToken = (user: UserType) => {
    return jwt.sign(user, accessTokenSecret, { expiresIn: process.env.TOKEN_EXPIRATION });
};

// Generate Refresh Token
export const generateRefreshToken = (user:UserType) => {
    const refreshToken = jwt.sign(user, refreshTokenSecret);
    refreshTokens.push(refreshToken); // Store refresh token
    return refreshToken;
};

// Middleware to authenticate JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string | undefined;
    const token = authHeader
    
    if (!token){
        res.sendStatus(401); 
        return
    } 

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err){
            res.sendStatus(403);
            return;
        }
        req.user = user  as JwtPayload; 
        next();
    });
};


export const refreshAccessToken = (req: Request, res: Response, next: NextFunction): void => {
    const { token } = req.body;

    if (!token || !refreshTokens.includes(token)) {
        res.sendStatus(403); // Forbidden
        return;
    }

    jwt.verify(token, refreshTokenSecret, (err: any, decoded: any) => {
        if (err && err instanceof Error) {
            res.sendStatus(403); // Forbidden
            return;
        }

        // Handle the decoded user, which could be JwtPayload or string
        const user = decoded as JwtPayload; // Cast to JwtPayload

        if (user && typeof user === 'object' && user.username) {
            const newAccessToken = generateAccessToken({ username: user.username, password: "" }); // Ensure password is optional
            res.json({ accessToken: newAccessToken });
        } else {
            res.sendStatus(403); // Forbidden if no valid user data
        }
    });
};

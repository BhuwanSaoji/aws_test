import { Response, Request } from "express"
import { errorObject, successObject } from "../helpers/commonHelper";
import { HTTPS_STATUS_BAD_REQUEST, HTTPS_STATUS_INTERNAL_SERVER_ERROR, HTTPS_STATUS_NOT_FOUND, HTTPS_STATUS_OK, HTTPS_STATUS_UNAUTHORIZED } from "../helpers/HTTPStatusConstants";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwtHelper";
import { z } from "zod";
import { userSchema } from "../validator/userValidator";


export type UserType =  {username: string, password: string}
const users: UserType[]  = [];

export const loginUser =(req:Request, res: Response)=>{
    try {
        const { username, password } = req.body;
        if(users.length==0){
            errorObject(res,HTTPS_STATUS_NOT_FOUND, 'error', "User not found");
            return;
        }
        const user: UserType | undefined = users.find( (u: UserType) => u.username === username && u.password === password);
        
        if (!user){
            errorObject(res, HTTPS_STATUS_UNAUTHORIZED, "error", "Username and password doesn't match! ")
            return;
        } 

        const accessToken = generateAccessToken(user);
        // const refreshToken = generateRefreshToken(user);
        
        res.json( {statusCode: HTTPS_STATUS_OK, status:"success", data: accessToken });
    } catch (error) {
        if(error instanceof Error)
            errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR, error.message, "Failed to update the dish");
    }
}

export const registerUser = (req: Request, res: Response) => {
    try {
        const user =  userSchema.safeParse(req.body);
        if(!user.success){
            errorObject(res, HTTPS_STATUS_BAD_REQUEST, "error", user.error.format());
            return;
        }
        
        users.push(user.data);
        successObject(res, HTTPS_STATUS_OK, "success", "Registered user successfully");
    } catch (error) {
        if(error instanceof Error)
            errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR, error.message, "Failed to update the dish");
    }
    

}
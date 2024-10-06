import { Response } from 'express';
import logger from './logger';

export const errorObject = (
    res: Response, 
    statusCode: number, 
    status: string, 
    message: string | any = "Internal Server Error"
) => {
    logger.error(message)
    return res.status(statusCode).json({
        status,
        message
    });
};


export const successObject = <T>(
    res: Response, 
    statusCode: number, 
    status: string, 
    message: string = "success",
    data? : T | T[]
) => {
    
    logger.info(message);
    return res.status(statusCode).json({
        status,
        data
    });
};
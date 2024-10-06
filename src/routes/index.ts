import  { Router, Request, Response, NextFunction } from 'express';
import dishRoutes from './dishes';
import loginRoutes from './login';
import { HTTPS_STATUS_NOT_FOUND } from '../helpers/HTTPStatusConstants';
import { errorObject, successObject } from '../helpers/commonHelper';
import { authenticateToken } from '../helpers/jwtHelper';
import { registerUser } from '../controller/loginController';

const router = Router();

//dishes routes
router.use("/login", loginRoutes )
router.post("/register", registerUser);
router.use("/health", checkHealth);
router.use('/dishes', dishRoutes);

router.use((req, res) => {
    errorObject(res,HTTPS_STATUS_NOT_FOUND,"Not Found", "Endpoint not found!!")
});


async function checkHealth(req: Request, res: Response){
    try {
        successObject(res, 200,  "success");
    } catch (error) {
        if (error instanceof Error) {
            errorObject(res, 500, "Internal Server Error", error.message);
        } else {
            errorObject(res, 500, "Internal Server Error", "An unknown error occurred");
        }
    }
}


export default router;

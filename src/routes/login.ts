import { Router } from "express";
import { loginUser} from "../controller/loginController";

const route = Router();

// login
route.post("/", loginUser);

export default route;
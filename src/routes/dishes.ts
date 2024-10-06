import { Router } from "express";
import { getDishes, deleteDishByName, saveDish, updateDish, getDishesFromIngredients, getIngredientsList } from "../controller/dishesController";
import { authenticateToken } from "../helpers/jwtHelper";

const route = Router();

// get the dishes 
route.use(authenticateToken);

route.get("/:pageNumber/:size", getDishes);

// delete the dish by id
route.delete("/", deleteDishByName);

// save a new dish
route.post("/", saveDish);

// update a new dish
route.put("/", updateDish);


// find by ingredients 
route.post("/find", getDishesFromIngredients);
export default route;

// /get list of ingredients
route.get("/ingredients", getIngredientsList)
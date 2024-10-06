import fs from 'fs';
import INDIAN_CUISINE from "../data/indian_food.json"
import logger from "../helpers/logger";
import { Dish } from '../validator/dishesValidator';

export interface Dishes {
    name: string;            
    ingredients: string | -1;     
    diet: string | -1;
    prep_time: number;    
    cook_time: number ;
    flavor_profile: string | -1; 
    course: string | -1;
    state: string | -1;
    region: string | -1;
}


export const getIngredientsModel = async (): Promise<{ key: string; text: string }[]> => {
    let ingredientsSet: Set<string> = new Set();
    INDIAN_CUISINE.forEach(dish => {
        let ingredients = dish.ingredients.split(",").map(ingredient => ingredient.toLowerCase().trim());
        ingredients.forEach(ingredient => ingredientsSet.add(ingredient));
    });

    return Array.from(ingredientsSet).map(ingredient => ({
        key: ingredient, 
        text: ingredient 
    }));
};




export const getDishesFromModel =async(query: string | undefined, filter: any ) : Promise<Dish[]> =>{
    try {
        let data : Dish[] | [] ;
        
        
        if(query){

            data = INDIAN_CUISINE.filter(dish => 
                dish.name.toLowerCase().includes(query) ||
                dish.ingredients.toLowerCase().includes(query) ||
                dish.state.toString().toLowerCase().includes(query) || 
                dish.diet.toString().toLowerCase().includes(query) || 
                dish.region.toString().toLowerCase().includes(query) 
        
            ) as Dish[]
        }else if(Object.keys(filter).length>0){
            const key = Object.keys(filter)[0] as keyof Dish; // Type assertion for key
            let value = filter[key]
            data = INDIAN_CUISINE.filter(dish => 
                dish[key].toString().toLowerCase().includes(value.toLowerCase())
            ) as Dish[]
        }else{
            data = INDIAN_CUISINE;
        }
        return data;
    } catch (error) {
        if(error instanceof Error)
            logger.error(error.message)
        logger.error("Something went wrong")
    }
    return [];
}


export const getDishesFromIngredientsModel =async(ingredients: string[] | undefined ) : Promise<Dish[]> =>{
    try {
        let data : Dish[] | [] = INDIAN_CUISINE.filter(dish => {
            let ingredients_array = dish.ingredients.split(",").map(item=>item.toLowerCase().trim());
            return ingredients?.every(item=>ingredients_array.includes(item.toLowerCase().trim()));
        }) as Dish[]
        
        return data;
    } catch (error) {
        if(error instanceof Error)
            logger.error(error.message)
        logger.error("Something went wrong")
    }
    return [];
}


export const deleteDishModel =async(name: string | undefined ) =>{
    try {
        let data : Dish[] | [] = INDIAN_CUISINE.filter(dish => dish.name.toLowerCase()!=name) as Dish[];
        return data

    } catch (error) {
        if(error instanceof Error)
            logger.error(error.message)
        logger.error("Something went wrong")
    }
}

export const saveNewDishModel =async(newDish : Dish ) =>{
    try {
        const path = "src/data/indian_food.json"
        const data = fs.readFileSync(path, 'utf-8');
        let dishes: Dish[] = JSON.parse(data); 
        dishes.push(newDish);
        fs.writeFileSync(path, JSON.stringify(dishes, null, 2));
    } catch (error) {
        if(error instanceof Error)
            logger.error(error.message)
        logger.error("Something went wrong")
    }
    return [];
}

export const updateDishModel = async (name: string, updatedDish: Dish ) => {
    try {
        const path = "src/data/indian_food.json"
        const data = fs.readFileSync(path, 'utf-8');
        let dishes: Dish[] = JSON.parse(data); 
        const index = dishes.findIndex(dish => dish.name.toLowerCase() === name);

        if (index === -1) {
            return null;
        }

        // Update the dish
        dishes[index] = updatedDish;

        fs.writeFileSync(path, JSON.stringify(dishes, null, 2));
        return dishes[index];
    } catch (error) {
        if (error instanceof Error) {
            logger.error(error.message);
        }
        logger.error("Something went wrong");
        throw error; // Rethrow the error for the controller to handle
    }
};

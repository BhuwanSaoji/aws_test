import { Request, Response } from "express";
import {errorObject, successObject} from "../helpers/commonHelper"
import { HTTPS_STATUS_BAD_REQUEST, HTTPS_STATUS_INTERNAL_SERVER_ERROR, HTTPS_STATUS_OK } from "../helpers/HTTPStatusConstants";
import { getDishesFromModel, deleteDishModel, getDishesFromIngredientsModel, saveNewDishModel, updateDishModel, getIngredientsModel } from "../model/dishesModel";
import { dishSchema } from "../validator/dishesValidator";


export const getDishes = async (req: Request, res: Response)=>{
    try {
        let query: string | undefined = req.query.search?.toString().toLowerCase();
        let filter: object | undefined = req.query;

        let pageNumber = parseInt(req.params.pageNumber) -1 || 0; 
        let size = parseInt(req.params.size) || 10; 
        let start = pageNumber * size; 
        let end = start + size;

        let data = await getDishesFromModel(query, filter);
        const length = data.length;
        if(length>10){
            data = data.slice(start, end);
        }
        
        const totalPages = Math.ceil(length / size);
        
        let obj = { data, totalPages };
        
        successObject(res,HTTPS_STATUS_OK,"success", "Data fetched successfully", obj);
    } catch (error) {
        console.error(error, "error");
        errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR,"Error", "Failed to delete the dish");

    }

}

export const getDishesFromIngredients = async (req: Request, res: Response)=>{
    try {
        let availableIngredients: string[] | undefined = req.body;
        if(!availableIngredients || availableIngredients.length==0){
            errorObject(res, HTTPS_STATUS_BAD_REQUEST, "error", "Ingredients list is empty");
        }
        let data  = await getDishesFromIngredientsModel(availableIngredients);
        successObject(res,HTTPS_STATUS_OK,"success", "Data searched successfully", data);

    } catch (error) {
        errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR,"Error", "Failed to delete the dish");
    }

}


export const getIngredientsList = async (req: Request, res: Response)=>{
    try {
       
        
        let data  = await getIngredientsModel();
        successObject(res,HTTPS_STATUS_OK,"success", "Data searched successfully", data);

    } catch (error) {
        errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR,"Error", "Failed to delete the dish");
    }

}


export const deleteDishByName = async(req: Request, res: Response)=>{
    try {

        let name: string | undefined = req.query.name?.toString().toLowerCase();
        if(!name){
            errorObject(res, HTTPS_STATUS_BAD_REQUEST, "error" ,"Name not found to delete");
        }
        const data =await  deleteDishModel(name);

        successObject(res,HTTPS_STATUS_OK,"success", "Data deleted successfully", data);
        
    } catch (error) {
        errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR,"Error", "Failed to delete the dish");
    }
    
}

export const updateDish = async (req: Request, res: Response) => {
    try {
        const name: string  | undefined= req.query.name?.toString().toLowerCase(); 
        const updatedDish = dishSchema.safeParse(req.body) 

        if (!updatedDish.success) {
            errorObject(res, HTTPS_STATUS_BAD_REQUEST, "error", updatedDish.error.format());
            return
        }
        
        if(typeof name != "string" || !name || name.length==0){
            errorObject(res, HTTPS_STATUS_BAD_REQUEST, "error", "Dish name cannot be null or empty");
            return;
        }

        const updatedData = await updateDishModel(name, updatedDish.data);

        if (!updatedData) {
             errorObject(res, HTTPS_STATUS_BAD_REQUEST, "error", "Dish not found");
             return
        }

        successObject(res, HTTPS_STATUS_OK, "success", "Dish updated successfully", updatedData);
        return
    } catch (error) {
        if(error instanceof Error)
            errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR, error.message, "Failed to update the dish");
    }
}

export const saveDish = (req: Request, res: Response)=>{
    try {
        let newDish = dishSchema.safeParse(req.body);
        if (!newDish.success) {
            errorObject(res, HTTPS_STATUS_BAD_REQUEST, "error", newDish.error.format());
            return
        }
        
        saveNewDishModel(newDish.data);
        successObject(res, HTTPS_STATUS_OK, "success", "Data saved successfully", newDish.data)
        
    } catch (error) {
        console.error(error, "error");
        errorObject(res, HTTPS_STATUS_INTERNAL_SERVER_ERROR,"Error", "Failed to create the dish");
    }
    
}
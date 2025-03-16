import { Request, Response } from "express";
import {T} from "../libs/types/common"

const adminController: T = {};
adminController.goHome("/", (req: Request, res: Response)=> {
    try {
        console.log("admin home page")

    } catch(error){
        console.log("home error", error)
    }
})
adminController.login("/", (req: Request, res: Response)=> {
    try {
        console.log("admin login page")

    } catch(error){
        console.log("home error", error)
    }
})
adminController.singin("/", (req: Request, res: Response)=> {
    try {
        console.log("admin signin page")

    } catch(error){
        console.log("home error", error)
    }
})

export default adminController;
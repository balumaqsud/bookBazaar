import { Request, Response } from "express";
import {T} from "../libs/types/common"
import MemberService from "../model/Member.service";

const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
    try {
        res.send("Admin Home page")
    } catch (error) {
        console.log("goHome", error)
    }
}
adminController.login = (req: Request, res: Response) => {
    try {
        res.send("Admin login page")
    } catch (error) {
        console.log("goHome", error)
    }
}
adminController.signin = (req: Request, res: Response) => {
    try {
        res.send("Admin signin page")
    } catch (error) {
        console.log("goHome", error)
    }
}

export default adminController;


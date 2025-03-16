import {Request, Response} from "express";
import {T} from "../libs/types/common";


const memberCotroller: T = {}
memberCotroller.goHome = (req: Request, res: Response) => {
    try {
        res.send("home page")    
    } catch (error) {
        console.log("home error: ", error)
    }
}
memberCotroller.login = (req: Request, res: Response) => {
    try {
        res.send("login page")    
    } catch (error) {
        console.log("home error: ", error)
    }
}
memberCotroller.signin = (req: Request, res: Response) => {
    try {
        res.send("singin page")    
    } catch (error) {
        console.log("home error: ", error)
    }
}
export default memberCotroller;
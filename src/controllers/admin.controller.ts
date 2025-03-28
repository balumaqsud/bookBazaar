import { Request, Response } from "express";
import {T} from "../libs/types/common"
import MemberService from "../model/Member.service";
import { MemberInput, LoginInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.types";

const adminController: T = {};  //Object with type of T

const memberService = new MemberService()  //instance from MemberService! 

adminController.goHome = (req: Request, res: Response) => {
    try {
        res.render("home")
    } catch (error) {
        console.log("goHome", error)
    }
}
adminController.login = (req: Request, res: Response) => {
    try {
        res.render("login")
    } catch (error) {
        console.log("goHome", error)
    }
}

adminController.signup = (req: Request, res: Response) => {
    try {
        res.render("signup")
    } catch (error) {
        console.log("sigin", error)
    }
}
//singin process
adminController.proccessSignUp = async (req: Request, res: Response) => {
    try {
        //getting user's request
        console.log("Process signUP")
        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.ADMIN;   //setting memberType as Admin

        //passing it to MemberService's method and getting result
        const result = await memberService.proccessSignUp(newMember)
        res.send(result)
    } catch (error) {
        console.log("Process signUp error", error)
        res.send(error)
    }
}

//login process
adminController.proccessLogin = async (req: Request, res: Response) => {
    try {
        console.log('login process')
        //getting user's request with type of  LoginType
        const input: LoginInput = req.body   

         //passing input to proccessLogin Method of memberService;
        const result = await memberService.proccessLogin(input) 
        res.send(result)
    } catch (error) {
        console.log("proccessLogin", error)
        res.send(error)
    }
}

export default adminController;


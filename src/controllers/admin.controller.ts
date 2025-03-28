import { Request, Response } from "express";
import {T} from "../libs/types/common"
import MemberService from "../model/Member.service";
import { MemberInput, LoginInput, loginRequest } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.types";
import Errors, {Message} from "../libs/Errors";


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
adminController.proccessSignUp = async (req: loginRequest, res: Response) => {
    try {
        //getting user's request
        console.log("Process signUP")
        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.ADMIN;   //setting memberType as Admin

        //passing it to MemberService's method and getting result
        const result = await memberService.proccessSignUp(newMember)
        req.session.member = result;
        req.session.save(()=>{
            res.send(result)
        })
    } catch (error) {
        console.log("Process signUp error", error)
        const message = error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}"): window.location.replace('admin/login')</script> `)
    }
}

//login process
adminController.proccessLogin = async (req: loginRequest, res: Response) => {
    try {
        console.log('login process')
        //getting user's request with type of  LoginType
        const input: LoginInput = req.body   

         //passing input to proccessLogin Method of memberService;
        const result = await memberService.proccessLogin(input) 
        req.session.member = result;
        req.session.save(()=>{
            res.send(result)
        })
    } catch (error) {
        console.log("proccessLogin", error)
        const message = error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}"): window.location.replace('admin/login')</script> `)
    }
}

adminController.checkAuthSession = async (req: loginRequest, res: Response) =>{
    try {
        if(req.session?.member) res.send(`Hiiii, ${req.session.member.memberNick}`)
        else{res.send(Message.NOT_AUTHENTICATED)}
        
    } catch (error) {
        console.log("checkAuthSession:", error)
        res.send(error)
    }
}

export default adminController;


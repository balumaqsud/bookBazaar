import { Request, Response } from "express";
import {T} from "../libs/types/common"
import MemberService from "../model/Member.service";
import { MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.types";

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
adminController.proccessLogin = (req: Request, res: Response) => {
    try {
        res.send("proccessLogin page")
    } catch (error) {
        console.log("proccessLogin", error)
    }
}

adminController.signup = (req: Request, res: Response) => {
    try {
        res.send("signin page")
    } catch (error) {
        console.log("sigin", error)
    }
}
adminController.proccessSignUp = async (req: Request, res: Response) => {
    try {
        //gettinguser's response 
        console.log("Process signUP")
        const newMember: MemberInput = req.body;
        console.log(newMember)
        newMember.memberType = MemberType.ADMIN;

        //passing it to memberservice's method and getting result
        const memberService = new MemberService()
        const result = await memberService.proccessSignUp(newMember)
        res.send(result)
    } catch (error) {
        console.log("Process signIn error", error)
        res.send(error)
    }
}
export default adminController;


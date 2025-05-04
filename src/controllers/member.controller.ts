import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../model/Member.service";
import {
  MemberInput,
  Member,
  LoginInput,
  ExtendedRequest,
} from "../libs/types/member";
import Errors, { HttpCode } from "../libs/Errors";

const memberService = new MemberService();

const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("login page");
    const input: MemberInput = req.body,
      result: Member = await memberService.signup(input);

    res.json({ member: result });
  } catch (error) {
    console.log("error in signup:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login page");
    const input: LoginInput = req.body,
      result = await memberService.login(input);

    res.json({ member: result });
  } catch (error) {
    console.log("home error: ", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout page");
    const input: ExtendedRequest = req.body;

    res.status(HttpCode.OK).json({ logout: true });
  } catch (error) {
    console.log("home error: ", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
export default memberController;

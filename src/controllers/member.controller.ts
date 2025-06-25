import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../model/Member.service";
import {
  MemberInput,
  Member,
  LoginInput,
  ExtendedRequest,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import AuthService from "../model/Auth.service";

const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signin page");
    const input: MemberInput = req.body;
    const result: Member = await memberService.signup(input);

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

//detail
memberController.getMemberDetail = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    console.log("getMemberDetail");
    const result = await memberService.getMemberDetail(req.member);
    res.status(HttpCode.OK).json(result);
  } catch (error) {
    console.log("logout, error:", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateMember");
    const input: MemberUpdateInput = req.body;
    if (req.file) input.memberImage = req.file.path.replace(/\\/g, "/");
    const result = await memberService.updateMember(req.member, input);

    res.status(HttpCode.OK).json(result);
  } catch (error) {
    console.log("updateMember, error:", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getTopUsers = async (req: Request, res: Response) => {
  try {
    console.log("getTopUsers");
    const result = await memberService.getTopUsers();
    res.status(HttpCode.OK).json(result);
  } catch (error) {
    console.log("getTopUsers, error:", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) {
      req.member = await authService.checkAuth(token);
    }
    if (!req.member)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    next();
  } catch (error) {
    console.log("verifyAuth error", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["accessToken"];

    if (token) {
      req.member = await authService.checkAuth(token);
    }
    next();
  } catch (error) {
    console.log("retrieveAuth, error", error);
    next();
  }
};
export default memberController;

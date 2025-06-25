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
import { AUTH_TIME } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};

memberController.getAdmin = async (req: Request, res: Response) => {
  try {
    console.log("getRestaurant");
    const result = await memberService.getAdmin();

    res.status(HttpCode.OK).json(result);
  } catch (error) {
    console.log("getRestaurant, error:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("SignUp");
    const input: MemberInput = req.body,
      result: Member = await memberService.signup(input),
      token = await authService.createToken(result);
    console.log(token);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIME * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (error) {
    console.log("signup, error:", error);
    if (error instanceof Errors) res.status(error.code).json(error);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = req.body,
      result: Member = await memberService.login(input),
      token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIME * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (error) {
    console.log("login, error:", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout page");
    const input: ExtendedRequest = req.body;

    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
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

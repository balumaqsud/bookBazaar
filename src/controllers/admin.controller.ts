import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../model/Member.service";
import { MemberInput, LoginInput, AdminRequest } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const adminController: T = {}; //Object with type of T

const memberService = new MemberService(); //instance from MemberService!

adminController.goHome = (req: Request, res: Response) => {
  try {
    res.render("home");
  } catch (error) {
    console.log("goHome", error);
  }
};
adminController.login = (req: Request, res: Response) => {
  try {
    res.render("login");
  } catch (error) {
    console.log("goHome", error);
  }
};

adminController.signup = (req: Request, res: Response) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log("signin", error);
  }
};
//signin process
adminController.processSignUp = async (req: AdminRequest, res: Response) => {
  try {
    //getting user's request
    console.log("Process signUP");
    const newMember: MemberInput = req.body;
    if (!req.file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.PROFILE_IMAGE_NEEDED);
    newMember.memberType = MemberType.ADMIN; //setting memberType as Admin

    //passing it to MemberService's method and getting result
    const result = await memberService.processSignUp(newMember);
    req.session.member = result;
    req.session.save(() => {
      res.redirect("/admin/product/all");
    });
  } catch (error) {
    console.log("Process signUp error", error);
    const message =
      error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.reload(); window.location.replace('login')</script> `
    );
  }
};
//login process
adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("login process");
    //getting user's request with type of  LoginType
    const input: LoginInput = req.body;

    //passing input to processLogin Method of memberService;
    const result = await memberService.processLogin(input);
    req.session.member = result;
    req.session.save(() => {
      res.redirect("/admin/product/all");
    });
  } catch (error) {
    console.log("processLogin", error);
    const message =
      error instanceof Errors ? error.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}");  window.location.reload();  window.location.replace('/admin/login')</script> `
    );
  }
};
//checking if auth session works
adminController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    if (req.session?.member)
      res.send(
        `<script>alert("${req.session.member.memberNick}");  window.location.reload(); window.location.replace('/admin/login')</script> `
      );
    else {
      res.send(
        `<script>alert("${Message.NOT_AUTHENTICATED}");  window.location.reload(); window.location.replace('/admin/login')</script>`
      );
    }
  } catch (error) {
    console.log("checkAuthSession:", error);
    res.send(error);
  }
};
//logout
adminController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(() => {
      res.redirect("/admin/login");
    });
  } catch (error) {
    console.log("logout error", error);
    res.redirect("/admin/login");
  }
};

adminController.getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("getAllUsers");
    const result = await memberService.getAllUsers();
    res.render("users", { users: result });
  } catch (error) {
    console.log("getAllUsers error", error);
    res.redirect("/admin/login");
  }
};
adminController.updateTheUser = async (req: AdminRequest, res: Response) => {
  try {
    console.log("updateTheUser");
    const result = await memberService.updateTheUser(req.body);
    return res.status(200).json({ data: result });
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else res.json(Errors.standard.code).json(Errors.standard.message);
  }
};
//creating method that later works as middleware, to check if admin.memberType is Admin, using next()
adminController.verifyAdmin = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.ADMIN) {
    req.member = req.session.member; //this line +
    next();
  } else {
    res.send(
      `<script>alert("${Message.NOT_AUTHENTICATED}"); window.location.reload(); window.location.replace('/admin/login')</script>`
    );
  }
};

export default adminController;

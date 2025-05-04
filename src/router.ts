import express from "express";
import memberController from "./controllers/member.controller";

const router = express.Router();

//routers
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/member/logout", memberController.logout);

export default router;

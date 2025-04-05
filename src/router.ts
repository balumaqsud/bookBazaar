import express from "express";
import memberController from "./controllers/member.controller";

const router = express.Router();

//routers
router.post("/login", memberController.login);
router.post("/signup", memberController.signup);

export default router;

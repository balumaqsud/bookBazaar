import express from "express";
import memberCotroller from "./controllers/member.controller";

const router = express.Router()

//routers
router.post("/login", memberCotroller.login);
router.post("/signup", memberCotroller.signup);

export default router;
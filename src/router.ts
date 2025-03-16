import express from "express";
import memberCotroller from "./controllers/member.controller";

const router = express.Router()

//routers
router.get("/", memberCotroller.goHome);
router.get("/login", memberCotroller.login);
router.get("/signin", memberCotroller.signin);

export default router;
import express, {Request, Response } from "express";

const router = express.Router()

//routers
router.get("/", (req: Request, res: Response)=> {
    res.send("home page")
});
router.get("/login", (req: Request, res:Response)=>{
    res.send("login page")
});

router.get("/signin", (req: Request, res: Response)=> {
    res.send("signin")
});

export default router;
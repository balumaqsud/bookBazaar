import express from "express"
import adminController from "./controllers/admin.controller"

const routerAdmin = express.Router();

routerAdmin.get('/', adminController.goHome);
routerAdmin.get('/login', adminController.login).post("/login", adminController.proccessLogin);
routerAdmin.get('/signup', adminController.signup).post("/signup", adminController.proccessSignUp);

routerAdmin.get("/check-me", adminController.checkAuthSession);
routerAdmin.post('/logout', adminController.logout);


export default routerAdmin;
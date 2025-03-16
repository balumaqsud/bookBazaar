import express from "express"
import adminController from "./controllers/admin.controller"

const routerAdmin = express.Router();

routerAdmin.get("/", adminController.goHome);
routerAdmin.get("/", adminController.login);
routerAdmin.get("/", adminController.signin);

export default routerAdmin;
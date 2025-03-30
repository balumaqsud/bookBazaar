import express from "express";
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";

const routerAdmin = express.Router();

//member
routerAdmin.get("/", adminController.goHome);
routerAdmin
  .get("/login", adminController.login)
  .post("/login", adminController.proccessLogin);
routerAdmin
  .get("/signup", adminController.signup)
  .post("/signup", adminController.proccessSignUp);

routerAdmin.get("/check-me", adminController.checkAuthSession);
routerAdmin.get("/logout", adminController.logout);

//product
routerAdmin.get("/product/all", productController.getAllProducts);
routerAdmin.post("/product/create", productController.createNewProduct);
routerAdmin.post("/product/:id", productController.updateTheProduct);

export default routerAdmin;

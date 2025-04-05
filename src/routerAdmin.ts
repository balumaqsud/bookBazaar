import express from "express";
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";
import uploader from "./libs/utils/uploader";
import memberController from "./controllers/member.controller";

const routerAdmin = express.Router();

//member
routerAdmin.get("/", adminController.goHome);
routerAdmin
  .get("/login", adminController.login)
  .post("/login", adminController.processLogin);
routerAdmin
  .get("/signup", adminController.signup)
  .post(
    "/signup",
    uploader("members").single("memberImage"),
    adminController.processSignUp
  );

routerAdmin.get("/check-me", adminController.checkAuthSession);
routerAdmin.get("/logout", adminController.logout);

//product
routerAdmin.get(
  "/product/all",
  adminController.verifyAdmin, //functioning as middleware to check the admin
  productController.getAllProducts
);
routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  uploader("products").array("productImages", 6),
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  adminController.verifyAdmin,
  productController.updateTheProduct
);
//user
routerAdmin.get(
  "/user/all",
  adminController.verifyAdmin,
  adminController.getAllUsers
);
routerAdmin.post(
  "/user/edit",
  adminController.verifyAdmin,
  adminController.updateTheUser
);

export default routerAdmin;

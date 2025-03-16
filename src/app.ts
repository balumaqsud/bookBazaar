import express from "express"
import router from "./router"
import routerAdmin from "./routerAdmin";
import path from "path"

//enterance ---middlewares
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

//sessions
//views
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");

//routning
app.use("/", router);                   // will be build in React
app.use("/admin", routerAdmin);         // will be build in EJS

export default app;
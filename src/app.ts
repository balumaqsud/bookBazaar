import express from "express"
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

//routnig


export default app;
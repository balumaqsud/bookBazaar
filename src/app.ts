import express from "express"

//enterance ---middlewares
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

//sessions
//views
app.set("views", "views");
app.set("view engine", "ejs");

//routnig


export default app;
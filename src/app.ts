import express from "express";
import router from "./router";
import routerAdmin from "./routerAdmin";
import path from "path";
import morgan from "morgan";
import { MORGAN_STANDARD } from "./libs/config";
import { T } from "./libs/types/common";
import dotenv from "dotenv";
dotenv.config();
//for sessions
import session from "express-session";
import ConnectMongoDb from "connect-mongodb-session";

//creating store object:
const MongoStore = ConnectMongoDb(session);
const store = new MongoStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

//enterance ---middlewares
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_STANDARD));

//sessions
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 8, // 8 hours
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

//middleware for getting member from request and passing to res
app.use((req, res, next) => {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

//views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//routning
app.use("/", router); // will be build in React
app.use("/admin", routerAdmin); // will be build in EJS

export default app;

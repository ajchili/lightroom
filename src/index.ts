import * as bodyparser from "body-parser";
import cors from "cors";
import express from "express";
import { Application } from "express";
import partials from "express-partials";
import index from "./routes";
import hue from "./routes/hue";

const PORT = process.env.port || 8080;

const app = express() as Application;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
app.use(partials());
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.get("/", index);
app.use("/hue", hue);

app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server listening at http://localhost:${PORT}`);
});

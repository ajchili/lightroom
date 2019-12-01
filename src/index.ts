import * as bodyparser from "body-parser";
import cors from "cors";
import express from "express";
import { Application } from "express";
import hue from "./routes/hue";

const PORT = process.env.port || 8080;

const app = express() as Application;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Hello, World!");
});
app.use("/hue", hue);

app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server listening at http://localhost:${PORT}`);
});

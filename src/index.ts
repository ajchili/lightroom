import express from "express";
import { Application } from "express";

const PORT = process.env.port || 8080;

const app = express() as Application;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server listening at http://localhost:${PORT}`);
});

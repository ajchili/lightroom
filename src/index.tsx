import * as bodyparser from "body-parser";
import cors from "cors";
import express from "express";
import { Application } from "express";
import hue from "./routes/hue";
import { renderToString } from "react-dom/server";
import Home from "./views/Home";
import React from "react";

const PORT = process.env.port || 8080;

const app = express() as Application;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

app.get("/", async (req, res) => {
  const component = renderToString(<Home />);
  const theHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>lightroom</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">${component}</div>
      </body>
    </html>
  `;
  res.send(theHtml);
});
app.use("/hue", hue);

app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server listening at http://localhost:${PORT}`);
});

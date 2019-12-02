import { Router } from "express";
import * as api from "../apis/hue";
import { LightState } from "../types/hue";

const router = Router();

router.get("/bridges", async (_, res) => {
  try {
    const bridges = await api.getBridges();
    res.json(bridges);
  } catch {
    res.status(500).send();
  }
});

router.post("/bridge/connect", async (req, res) => {
  const { internalipaddress = "" } = req.body;
  if (internalipaddress.length === 0) {
    return res.status(400).json({
      error: `An "internalipaddress" must be provided!`,
    });
  }
  try {
    const username = await api.connectToBridge(internalipaddress);
    res.render("hue/bridge/connect.ejs", {
      internalipaddress,
      username,
      error: null,
    });
  } catch (err) {
    if (
      err.some((e: any) => e.error.description === "link button not pressed")
    ) {
      res.render("hue/bridge/connect.ejs", {
        internalipaddress,
        username: "",
        error: "Link button not pressed on bridge!",
      });
    } else {
      res.render("hue/bridge/connect.ejs", {
        internalipaddress,
        username: "",
        error: "An unexpected error occurred!",
      });
    }
  }
});

router.get("/lights", async (req, res) => {
  const { internalipaddress = "", username = "" } = req.query;
  const missing: string[] = [];
  if (internalipaddress.length === 0) {
    missing.push("internalipaddress");
  }
  if (username.length === 0) {
    missing.push("username");
  }
  if (missing.length > 0) {
    const error = `A ${missing
      .map((e: string) => `"${e}"`)
      .join(", ")} must be provided!`;
    return res.status(400).json({ error });
  }
  try {
    const lights = await api.getLights(internalipaddress, username);
    res.render("hue/lights", { internalipaddress, username, lights });
  } catch (err) {
    console.log(err);
    res.render("hue/lights", { lights: [] });
  }
});

router.post("/light", async (req, res) => {
  const {
    internalipaddress = "",
    username = "",
    light = -1,
    on = null,
  } = req.body;
  const missing: string[] = [];
  if (internalipaddress.length === 0) {
    missing.push("internalipaddress");
  }
  if (username.length === 0) {
    missing.push("username");
  }
  if (light === -1) {
    missing.push("light");
  }
  if (on === null) {
    missing.push("on");
  }
  if (missing.length > 0) {
    const error = `A ${missing
      .map((e: string) => `"${e}"`)
      .join(", ")} must be provided!`;
    return res.status(400).json({ error });
  }
  const state: LightState = {
    on: on === "true",
  };
  try {
    await api.updateLight(internalipaddress, username, light, state);
    res.redirect(
      `/hue/lights?internalipaddress=${internalipaddress}&username=${username}`,
    );
  } catch (err) {
    res.status(500).json({
      errors: err,
    });
  }
});

export default router;

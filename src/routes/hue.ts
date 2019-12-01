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
    res.json({ username });
  } catch (err) {
    res.status(500).json({
      errors: err,
    });
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
    const error = `A ${missing.map((e: string) => `"${e}"`).join(", ")} must be provided!`;
    return res.status(400).json({ error });
  }
  const lights = await api.getLights(internalipaddress, username);
  res.json(lights);
});

router.put("/light", async (req, res) => {
  const { internalipaddress = "", username = "", light = -1, state: _state = null } = req.body;
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
  if (_state === null) {
    missing.push("state");
  }
  if (missing.length > 0) {
    const error = `A ${missing.map((e: string) => `"${e}"`).join(", ")} must be provided!`;
    return res.status(400).json({ error });
  }
  const state: LightState = _state;
  try {
    const status = await api.updateLight(internalipaddress, username, light, state);
    res.json(status);
  } catch (err) {
    res.status(500).json({
      errors: err,
    });
  }
});

export default router;

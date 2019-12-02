import { Router } from "express";
import * as api from "../apis/hue";
import { Bridge } from "../types/hue";

const router = Router();

router.get("/", async (_, res) => {
  let bridges: Bridge[] = [];
  try {
    bridges = await api.getBridges();
  } catch {
    // Ignore error
  }
  res.render("index", { bridges, internalipaddress: "", username: "" });
});

router.get("/connect", async (req, res) => {
  const { internalipaddress = "", username = "" } = req.query;
  try {
    await api.getLights(internalipaddress, username);
    res.render("connect", { error: null });
  } catch {
    res.render("connect", {
      error: "Invalid internalipaddress and/or username.",
    });
  }
});

export default router;

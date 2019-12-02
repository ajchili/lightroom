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

export default router;

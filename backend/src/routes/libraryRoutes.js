import express from "express";
import {
  createDevice,
  getCategories,
  getDevice,
  getDevices,
  removeDevice,
  searchDevices,
  updateDevice,
} from "../controllers/libraryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/search", searchDevices);
router.get("/devices", getDevices);
router.get("/devices/:deviceId", getDevice);
router.post("/devices", createDevice);
router.put("/devices/:deviceId", updateDevice);
router.delete("/devices/:deviceId", removeDevice);

export default router;

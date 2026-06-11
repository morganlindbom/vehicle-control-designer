import express from "express";
import {
  createDevice,
  getCategories,
  getFile,
  getFiles,
  getDevice,
  getDevices,
  removeDevice,
  removeFile,
  searchDevices,
  uploadFile,
  updateDevice,
} from "../controllers/libraryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/search", searchDevices);
router.get("/devices", getDevices);
router.get("/devices/:deviceId", getDevice);
router.get("/devices/:deviceId/files/:section", getFiles);
router.get("/devices/:deviceId/files/:section/:fileName", getFile);
router.post("/devices/:deviceId/files/:section", uploadFile);
router.delete("/devices/:deviceId/files/:section/:fileName", removeFile);
router.post("/devices", createDevice);
router.put("/devices/:deviceId", updateDevice);
router.delete("/devices/:deviceId", removeDevice);

export default router;

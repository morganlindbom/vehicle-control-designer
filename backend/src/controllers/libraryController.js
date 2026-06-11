import {
  createLibraryDevice,
  deleteDeviceFile,
  deleteLibraryDevice,
  getDeviceFile,
  getLibraryDevice,
  listLibraryCategories,
  listDeviceFiles,
  listLibraryDevices,
  searchLibraryDevices,
  uploadDeviceFile,
  updateLibraryDevice,
} from "../services/libraryService.js";

export async function getDevices(req, res) {
  const devices = await listLibraryDevices();
  res.json({ devices });
}

export async function getDevice(req, res) {
  const device = await getLibraryDevice(req.params.deviceId);
  if (!device) {
    return res.status(404).json({ message: "Device not found" });
  }

  return res.json({ device });
}

export async function getCategories(req, res) {
  const categories = await listLibraryCategories();
  res.json({ categories });
}

export async function searchDevices(req, res) {
  const devices = await searchLibraryDevices(req.query.q || "");
  res.json({ devices });
}

export async function createDevice(req, res) {
  const device = await createLibraryDevice(req.body);
  res.status(201).json({ device });
}

export async function updateDevice(req, res) {
  const device = await updateLibraryDevice(req.params.deviceId, req.body);
  if (!device) {
    return res.status(404).json({ message: "Device not found" });
  }

  return res.json({ device });
}

export async function removeDevice(req, res) {
  const deleted = await deleteLibraryDevice(req.params.deviceId);
  if (!deleted) {
    return res.status(404).json({ message: "Device not found" });
  }

  return res.status(204).send();
}

export async function getFiles(req, res) {
  const files = await listDeviceFiles(req.params.deviceId, req.params.section);
  if (!files) {
    return res.status(404).json({ message: "Device not found" });
  }

  return res.json({ files });
}

export async function getFile(req, res) {
  const file = await getDeviceFile(req.params.deviceId, req.params.section, req.params.fileName);
  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
  return res.send(file.content);
}

export async function uploadFile(req, res) {
  try {
    const file = await uploadDeviceFile(
      req.params.deviceId,
      req.params.section,
      req.body?.fileName,
      req.body?.contentBase64 || "",
    );

    if (!file) {
      return res.status(404).json({ message: "Device not found" });
    }

    return res.status(201).json({ file });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Failed to upload file" });
  }
}

export async function removeFile(req, res) {
  const deleted = await deleteDeviceFile(req.params.deviceId, req.params.section, req.params.fileName);
  if (!deleted) {
    return res.status(404).json({ message: "File not found" });
  }

  return res.status(204).send();
}

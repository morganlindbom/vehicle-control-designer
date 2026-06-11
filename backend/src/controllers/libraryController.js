import {
  createLibraryDevice,
  deleteLibraryDevice,
  getLibraryDevice,
  listLibraryCategories,
  listLibraryDevices,
  searchLibraryDevices,
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

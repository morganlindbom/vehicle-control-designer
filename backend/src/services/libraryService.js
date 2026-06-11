import fs from "fs/promises";
import path from "path";
import hardwareDevices from "../data/hardwareDevices.js";

const DEFAULT_LIBRARY_ROOT = path.resolve(process.cwd(), "../vehicle-control-library");
const ASSET_DIRS = ["datasheets", "pinouts", "schematics", "images", "source", "examples", "notes"];
const FILE_GROUPS = {
  datasheets: [".pdf", ".md", ".txt"],
  pinouts: [".png", ".jpg", ".jpeg", ".svg", ".pdf"],
  schematics: [".pdf", ".sch", ".kicad_sch", ".png", ".jpg", ".jpeg"],
  images: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
  source: [".h", ".hpp", ".c", ".cpp", ".ino", ".txt", ".md"],
  examples: [".h", ".hpp", ".c", ".cpp", ".ino", ".txt", ".md"],
  notes: [".md", ".txt"],
};

function getLibraryRoot() {
  return path.resolve(process.env.VEHICLE_CONTROL_LIBRARY_ROOT || DEFAULT_LIBRARY_ROOT);
}

function normalizeCategory(category) {
  return String(category || "controllers").toLowerCase();
}

function getDeviceFolder(record) {
  return path.join(getLibraryRoot(), record.githubFolder || `devices/${record.id}`);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dirPath) {
  if (!(await pathExists(dirPath))) return [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

async function readFileBuffer(filePath) {
  return fs.readFile(filePath);
}

function getRelativeAssetPath(record, section, fileName) {
  return path.join(record.githubFolder || `devices/${record.id}`, section, fileName);
}

function getRecordById(deviceId) {
  return hardwareDevices.find((device) => device.id === deviceId) || null;
}

async function scanDeviceFiles(record) {
  const folder = getDeviceFolder(record);
  const assets = {};

  for (const dirName of ASSET_DIRS) {
    assets[dirName] = await listFiles(path.join(folder, dirName));
  }

  const rootFiles = await listFiles(folder);
  return {
    rootFiles,
    assets,
  };
}

function buildListItem(record) {
  return {
    id: record.id,
    name: record.name,
    manufacturer: record.manufacturer,
    category: normalizeCategory(record.category),
    partNumber: record.partNumber,
    description: record.description,
    githubFolder: record.githubFolder,
  };
}

export async function listLibraryCategories() {
  return [
    { id: "controllers", label: "Controllers" },
    { id: "adc", label: "ADC Devices" },
    { id: "drivers", label: "PWM Drivers" },
    { id: "sensors", label: "Sensors" },
    { id: "communication", label: "Communication" },
    { id: "custom", label: "Custom Devices" },
  ];
}

export async function listLibraryDevices() {
  return hardwareDevices.map(buildListItem).sort((left, right) => left.name.localeCompare(right.name));
}

export async function getLibraryDevice(deviceId) {
  const record = getRecordById(deviceId);
  if (!record) return null;

  const fileData = await scanDeviceFiles(record);
  return {
    ...record,
    category: normalizeCategory(record.category),
    githubFolder: record.githubFolder || `devices/${record.id}`,
    files: fileData.rootFiles,
    assets: fileData.assets,
  };
}

export async function listDeviceFiles(deviceId, section) {
  const record = getRecordById(deviceId);
  if (!record) return null;

  const folder = path.join(getDeviceFolder(record), section);
  const files = await listFiles(folder);
  return files.map((file) => ({
    name: file.name,
    path: getRelativeAssetPath(record, section, file.name),
    section,
  }));
}

export async function getDeviceFile(deviceId, section, fileName) {
  const record = getRecordById(deviceId);
  if (!record) return null;

  const filePath = path.join(getDeviceFolder(record), section, fileName);
  if (!(await pathExists(filePath))) return null;

  return {
    name: fileName,
    path: getRelativeAssetPath(record, section, fileName),
    section,
    content: await readFileBuffer(filePath),
  };
}

export async function uploadDeviceFile(deviceId, section, fileName, contentBase64) {
  const record = getRecordById(deviceId);
  if (!record) return null;

  const normalizedSection = String(section || "").toLowerCase();
  const allowedExtensions = FILE_GROUPS[normalizedSection] || [];
  const extension = path.extname(fileName).toLowerCase();

  if (allowedExtensions.length && !allowedExtensions.includes(extension)) {
    const error = new Error("Unsupported file type");
    error.statusCode = 400;
    throw error;
  }

  const folder = path.join(getDeviceFolder(record), normalizedSection);
  await fs.mkdir(folder, { recursive: true });
  const filePath = path.join(folder, fileName);
  const buffer = Buffer.from(contentBase64, "base64");
  await fs.writeFile(filePath, buffer);

  return getDeviceFile(deviceId, normalizedSection, fileName);
}

export async function deleteDeviceFile(deviceId, section, fileName) {
  const record = getRecordById(deviceId);
  if (!record) return false;

  const filePath = path.join(getDeviceFolder(record), section, fileName);
  if (!(await pathExists(filePath))) return false;

  await fs.unlink(filePath);
  return true;
}

export async function searchLibraryDevices(query = "") {
  const devices = await listLibraryDevices();
  const needle = query.trim().toLowerCase();
  if (!needle) return devices;

  return devices.filter((device) => {
    const haystack = [device.id, device.name, device.manufacturer, device.partNumber, device.description, device.category]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

async function ensureDeviceFolders(record) {
  const folder = getDeviceFolder(record);
  await fs.mkdir(folder, { recursive: true });
  for (const dirName of ASSET_DIRS) {
    await fs.mkdir(path.join(folder, dirName), { recursive: true });
  }
}

export async function createLibraryDevice(payload) {
  const nextRecord = {
    id: payload.id,
    name: payload.name,
    manufacturer: payload.manufacturer,
    category: normalizeCategory(payload.category),
    description: payload.description,
    partNumber: payload.partNumber,
    specifications: payload.specifications || {},
    dependencies: payload.dependencies || {},
    generatorRules: payload.generatorRules || {},
    githubFolder: payload.githubFolder || `devices/${payload.id}`,
  };

  hardwareDevices.push(nextRecord);
  await ensureDeviceFolders(nextRecord);
  return getLibraryDevice(nextRecord.id);
}

export async function updateLibraryDevice(deviceId, payload) {
  const record = getRecordById(deviceId);
  if (!record) return null;

  record.name = payload.name;
  record.manufacturer = payload.manufacturer;
  record.category = normalizeCategory(payload.category);
  record.description = payload.description;
  record.partNumber = payload.partNumber;
  record.specifications = payload.specifications || {};
  record.dependencies = payload.dependencies || {};
  record.generatorRules = payload.generatorRules || {};
  record.githubFolder = payload.githubFolder || record.githubFolder || `devices/${record.id}`;

  await ensureDeviceFolders(record);
  return getLibraryDevice(deviceId);
}

export async function deleteLibraryDevice(deviceId) {
  const index = hardwareDevices.findIndex((device) => device.id === deviceId);
  if (index === -1) return false;

  const [record] = hardwareDevices.splice(index, 1);
  const folder = getDeviceFolder(record);
  await fs.rm(folder, { recursive: true, force: true });
  return true;
}

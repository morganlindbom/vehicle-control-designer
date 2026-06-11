import fs from "fs/promises";
import path from "path";
import hardwareDevices from "../data/hardwareDevices.js";

const DEFAULT_LIBRARY_ROOT = path.resolve(process.cwd(), "../vehicle-control-library");
const ASSET_DIRS = ["datasheets", "pinouts", "schematics", "images", "source", "examples", "generator"];

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

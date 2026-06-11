export const DEVICE_TYPES = [
  "Controller",
  "ADC",
  "PWM Driver",
  "Sensor",
  "Communication",
  "Custom Device",
];

export const DEVICE_CATEGORIES = [
  "controller",
  "adc",
  "driver",
  "sensor",
  "communication",
  "custom",
];

export const CATEGORY_OPTIONS = [
  { key: "controllers", label: "Controllers" },
  { key: "adc", label: "ADC Devices" },
  { key: "drivers", label: "PWM Drivers" },
  { key: "sensors", label: "Sensors" },
  { key: "communication", label: "Communication" },
  { key: "custom", label: "Custom Devices" },
];

export const GITHUB_DEVICE_ROOT = "devices";
export const GITHUB_DEVICE_ASSET_DIRS = [
  "datasheets",
  "pinouts",
  "schematics",
  "images",
  "source",
  "examples",
  "generator",
];

export const GITHUB_FILE_SECTION_MAP = {
  Datasheets: "datasheets",
  Pinouts: "pinouts",
  Schematics: "schematics",
  Images: "images",
};

export const GITHUB_SOURCE_SECTION_MAP = {
  Source: "source",
  Examples: "examples",
};

export const FILE_SECTIONS = Object.keys(GITHUB_FILE_SECTION_MAP);
export const SOURCE_CODE_SECTIONS = Object.keys(GITHUB_SOURCE_SECTION_MAP);
export const GENERATOR_RULES = ["rules.json", "extracted-text.txt", "ai-summary.txt"];

export const GENERATOR_RULE_FILES = ["rules.json", "extracted-text.txt", "ai-summary.txt"];

export const SPEC_TEMPLATES = {
  Controller: ["CPU", "Clock Speed", "RAM", "Flash", "ADC Count", "PWM Count"],
  ADC: ["Channels", "Resolution", "Voltage", "Interface"],
  "PWM Driver": ["Max Frequency", "Voltage", "Current"],
  Sensor: ["Signal Type", "Range", "Resolution"],
  Communication: ["Protocol", "Speed", "Voltage", "Channels"],
  "Custom Device": ["Purpose", "Interface", "Notes"],
};
export const DEPENDENCY_SECTIONS = ["Requires", "Used By", "Related Devices"];

export function createDeviceId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createEmptyDevice(type = "Controller") {
  return {
    id: "",
    name: "",
    type,
    category: "controllers",
    manufacturer: "",
    partNumber: "",
    version: "1.0",
    description: "",
    specifications: SPEC_TEMPLATES[type].reduce((specs, field) => {
      specs[field] = "";
      return specs;
    }, {}),
    files: Object.keys(GITHUB_FILE_SECTION_MAP).reduce((items, section) => {
      items[section] = [];
      return items;
    }, {}),
    sourceCode: Object.keys(GITHUB_SOURCE_SECTION_MAP).reduce((items, section) => {
      items[section] = [];
      return items;
    }, {}),
    dependencies: DEPENDENCY_SECTIONS.reduce((items, section) => {
      items[section] = [];
      return items;
    }, {}),
    generatorRules: {
      rules: { supportsADC: false, supportsPWM: false, supportsSPI: false },
      "extracted-text": "",
      "ai-summary": "",
    },
    githubFolder: `${GITHUB_DEVICE_ROOT}/new-device`,
  };
}

export function normalizeLibraryDevice(device) {
  if (!device) return null;

  return {
    ...createEmptyDevice(device.type || "Controller"),
    ...device,
    category: device.category || "controllers",
    generatorRules: {
      rules: device.generatorRules?.rules || {},
      "extracted-text": device.generatorRules?.["extracted-text"] || "",
      "ai-summary": device.generatorRules?.["ai-summary"] || "",
    },
  };
}

export function buildDevicePayload(draft) {
  return {
    id: draft.id,
    name: draft.name,
    manufacturer: draft.manufacturer,
    category: draft.category,
    partNumber: draft.partNumber,
    description: draft.description,
    type: draft.type,
    specifications: draft.specifications,
    dependencies: draft.dependencies,
    generatorRules: draft.generatorRules,
    githubFolder: draft.githubFolder,
  };
}

export function getGithubAssetFolder(section) {
  return GITHUB_FILE_SECTION_MAP[section] || GITHUB_SOURCE_SECTION_MAP[section] || section;
}

const hardwareDevices = [
  {
    id: "rp2350",
    name: "RP2350",
    manufacturer: "Raspberry Pi",
    category: "controllers",
    description: "Dual-core Cortex-M33 microcontroller",
    partNumber: "RP2350",
    specifications: {
      cpu: "Dual Cortex-M33",
      clockSpeed: "150MHz",
      ram: "520KB",
      flash: "2MB",
      adcCount: 4,
      pwmCount: 12,
      gpioCount: 30,
    },
    githubFolder: "devices/rp2350",
  },
  {
    id: "mcp3208",
    name: "MCP3208",
    manufacturer: "Microchip",
    category: "adc",
    description: "8-channel 12-bit ADC for analog sensor aggregation",
    partNumber: "MCP3208-CI/SL",
    specifications: {
      channels: 8,
      resolution: "12-bit",
      voltage: "2.7V - 5.5V",
      interface: "SPI",
    },
    githubFolder: "devices/mcp3208",
  },
  {
    id: "ir4427",
    name: "IR4427",
    manufacturer: "Infineon",
    category: "drivers",
    description: "Dual low-side MOSFET driver for PWM output stages",
    partNumber: "IR4427S",
    specifications: {
      maxFrequency: "1 MHz",
      voltage: "4.5V - 18V",
      current: "1.0A peak",
    },
    githubFolder: "devices/ir4427",
  },
];

export default hardwareDevices;
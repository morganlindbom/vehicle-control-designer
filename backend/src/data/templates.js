const templates = [
    {
        id: "throttle",
        category: "input",
        name: "Throttle",
        propertySchema: {
            min: {
                type: "number",
                default: 0
            },
            max: {
                type: "number",
                default: 4095
            },
            deadzone: {
                type: "number",
                default: 5
            }
        }
    },
    {
        id: "brake",
        category: "input",
        name: "Brake",
        propertySchema: {
            min: {
                type: "number",
                default: 0
            },
            max: {
                type: "number",
                default: 4095
            },
            deadzone: {
                type: "number",
                default: 5
            }
        }
    },
    {
        id: "motor_pwm",
        category: "output",
        name: "Motor PWM",
        propertySchema: {
            frequency: {
                type: "number",
                default: 25000
            },
            maxDuty: {
                type: "number",
                default: 100
            }
        }
    },
    {
        id: "hall_sensor",
        category: "sensor",
        name: "Hall Sensor",
        propertySchema: {
            polePairs: {
                type: "number",
                default: 15
            }
        }
    }
];

export default templates;
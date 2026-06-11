const projectComponents = {
    1: [
        {
            id: "comp001",
            templateId: "throttle",
            name: "Main Throttle",
            properties: {
                min: 0,
                max: 4095,
                deadzone: 5
            }
        },
        {
            id: "comp002",
            templateId: "motor_pwm",
            name: "Main Motor",
            properties: {
                frequency: 25000,
                maxDuty: 100
            }
        }
    ],
    2: [],
    3: []
};

export default projectComponents;
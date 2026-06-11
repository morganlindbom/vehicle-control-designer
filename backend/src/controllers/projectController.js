import projects from "../data/projects.js";
import templates from "../data/templates.js";
import projectComponents from "../data/projectComponents.js";
import projectConnections from "../data/projectConnections.js";
import projectHardware from "../data/projectHardware.js";

function getTemplateById(templateId) {
    return templates.find((template) => template.id === templateId);
}

function getNextComponentId(projectId) {
    const components = projectComponents[projectId] || [];

    return `comp${String(components.length + 1).padStart(3, "0")}`;
}

function getDefaultComponentName(template, projectId) {
    const components = projectComponents[projectId] || [];
    const count = components.length + 1;

    return `${template.name} ${count}`;
}

function getDefaultComponentProperties(templateId) {
    const template = getTemplateById(templateId);

    if (!template || !template.propertySchema) {
        return {};
    }

    return Object.entries(template.propertySchema).reduce((properties, [key, definition]) => {
        properties[key] = definition.default;
        return properties;
    }, {});
}

function findProjectComponent(projectId, componentId) {
    const components = projectComponents[projectId] || [];
    return components.find((component) => component.id === componentId);
}

function getNextConnectionId(projectId) {
    const connections = projectConnections[projectId] || [];

    return `conn${String(connections.length + 1).padStart(3, "0")}`;
}

export function getProjects(req, res) {
    res.json(projects);
}

export function getProjectById(req, res) {
    const projectId = Number(req.params.id);
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res.json({
        id: project.id,
        name: project.name,
        components: 0,
        connections: 0,
        hardwareProfile: null,
        hardwareDevices: projectHardware[projectId] || []
    });
}

export function createProject(req, res) {
    const nextId = projects.length ? Math.max(...projects.map((project) => project.id)) + 1 : 1;
    const project = {
        id: nextId,
        name: req.body?.name || `Project ${nextId}`
    };

    projects.push(project);

    res.status(201).json(project);
}

export function deleteProject(req, res) {
    const projectId = Number(req.params.id);
    const projectIndex = projects.findIndex((item) => item.id === projectId);

    if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found" });
    }

    projects.splice(projectIndex, 1);
    delete projectComponents[projectId];
    delete projectConnections[projectId];
    delete projectHardware[projectId];

    res.status(204).send();
}

export function getProjectHardware(req, res) {
    const projectId = Number(req.params.id);
    res.json({ devices: projectHardware[projectId] || [] });
}

export function addProjectHardwareDevice(req, res) {
    const projectId = Number(req.params.id);
    const { deviceId } = req.body;

    if (!deviceId) {
        return res.status(400).json({ message: "Invalid hardware device" });
    }

    if (!projectHardware[projectId]) {
        projectHardware[projectId] = [];
    }

    if (!projectHardware[projectId].includes(deviceId)) {
        projectHardware[projectId].push(deviceId);
    }

    res.status(201).json({ deviceId });
}

export function removeProjectHardwareDevice(req, res) {
    const projectId = Number(req.params.id);
    const deviceId = req.params.deviceId;
    const devices = projectHardware[projectId] || [];
    projectHardware[projectId] = devices.filter((item) => item !== deviceId);

    res.status(204).send();
}

export function getProjectComponents(req, res) {
    const projectId = Number(req.params.id);

    res.json(projectComponents[projectId] || []);
}

export function addProjectComponent(req, res) {
    const projectId = Number(req.params.id);
    const { templateId } = req.body;
    const template = getTemplateById(templateId);

    if (!projectComponents[projectId]) {
        projectComponents[projectId] = [];
    }

    if (!template) {
        return res.status(400).json({ message: "Invalid template" });
    }

    const components = projectComponents[projectId];
    const component = {
        id: getNextComponentId(projectId),
        templateId: template.id,
        name: getDefaultComponentName(template, projectId),
        properties: getDefaultComponentProperties(template.id)
    };

    components.push(component);

    res.status(201).json(component);
}

export function getProjectComponent(req, res) {
    const projectId = Number(req.params.projectId);
    const component = findProjectComponent(projectId, req.params.componentId);

    if (!component) {
        return res.status(404).json({ message: "Component not found" });
    }

    res.json(component);
}

export function updateProjectComponent(req, res) {
    const projectId = Number(req.params.projectId);
    const component = findProjectComponent(projectId, req.params.componentId);

    if (!component) {
        return res.status(404).json({ message: "Component not found" });
    }

    const { name, properties } = req.body;
    const nextName = typeof name === "string" && name.trim() ? name.trim() : component.name;
    const nextProperties = {
        ...component.properties,
        ...(properties || {})
    };

    if (
        Object.prototype.hasOwnProperty.call(nextProperties, "min") &&
        Object.prototype.hasOwnProperty.call(nextProperties, "max") &&
        Number(nextProperties.min) > Number(nextProperties.max)
    ) {
        return res.status(400).json({ message: "Invalid property values" });
    }

    component.name = nextName;
    component.properties = Object.entries(nextProperties).reduce((propertiesMap, [key, value]) => {
        propertiesMap[key] = Number(value);
        return propertiesMap;
    }, {});

    res.json(component);
}

export function deleteProjectComponent(req, res) {
    const projectId = Number(req.params.projectId);
    const components = projectComponents[projectId] || [];
    const componentIndex = components.findIndex((component) => component.id === req.params.componentId);

    if (componentIndex === -1) {
        return res.status(404).json({ message: "Component not found" });
    }

    const componentId = req.params.componentId;
    components.splice(componentIndex, 1);

    const connections = projectConnections[projectId] || [];
    projectConnections[projectId] = connections.filter(
        (connection) => connection.from !== componentId && connection.to !== componentId
    );

    res.status(204).send();
}

export function getProjectConnections(req, res) {
    const projectId = Number(req.params.projectId);

    res.json(projectConnections[projectId] || []);
}

export function addProjectConnection(req, res) {
    const projectId = Number(req.params.projectId);
    const { from, to } = req.body;

    if (!projectConnections[projectId]) {
        projectConnections[projectId] = [];
    }

    if (!from || !to) {
        return res.status(400).json({ message: "Invalid connection" });
    }

    if (from === to) {
        return res.status(400).json({ message: "Cannot connect component to itself" });
    }

    const fromComponent = findProjectComponent(projectId, from);
    const toComponent = findProjectComponent(projectId, to);

    if (!fromComponent || !toComponent) {
        return res.status(400).json({ message: "Invalid connection" });
    }

    const duplicateConnection = projectConnections[projectId].some(
        (connection) => connection.from === from && connection.to === to
    );

    if (duplicateConnection) {
        return res.status(400).json({ message: "Duplicate connection" });
    }

    const connection = {
        id: getNextConnectionId(projectId),
        from,
        to
    };

    projectConnections[projectId].push(connection);

    res.status(201).json(connection);
}

export function deleteProjectConnection(req, res) {
    const projectId = Number(req.params.projectId);
    const connections = projectConnections[projectId] || [];
    const connectionIndex = connections.findIndex(
        (connection) => connection.id === req.params.connectionId
    );

    if (connectionIndex === -1) {
        return res.status(404).json({ message: "Connection not found" });
    }

    connections.splice(connectionIndex, 1);

    res.status(204).send();
}
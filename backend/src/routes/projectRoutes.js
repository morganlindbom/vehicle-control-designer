import { Router } from "express";
import {
    getProjects,
    getProjectById,
    createProject,
    deleteProject,
    getProjectComponents,
    addProjectComponent,
    getProjectComponent,
    updateProjectComponent,
    deleteProjectComponent,
    getProjectConnections,
    addProjectConnection,
    deleteProjectConnection
} from "../controllers/projectController.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.get("/:id/components", getProjectComponents);
router.post("/:id/components", addProjectComponent);
router.get("/:projectId/components/:componentId", getProjectComponent);
router.put("/:projectId/components/:componentId", updateProjectComponent);
router.delete("/:projectId/components/:componentId", deleteProjectComponent);
router.get("/:projectId/connections", getProjectConnections);
router.post("/:projectId/connections", addProjectConnection);
router.delete("/:projectId/connections/:connectionId", deleteProjectConnection);

export default router;
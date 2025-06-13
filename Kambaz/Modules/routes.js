import express from 'express';
import * as modulesDao from "./dao.js";
import { isAuthenticated, isInstructor } from "../Users/dao.js";

const router = express.Router();

console.log("Module routes loaded - v2.0");

// Get all modules for a course
router.get("/courses/:courseId/modules", async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("Finding modules for course:", courseId);
    console.log("Route matched: /courses/:courseId/modules");
    const modules = await modulesDao.findModulesForCourse(courseId);
    console.log("Found modules:", modules);
    res.json(modules);
  } catch (error) {
    console.error("Error finding modules:", error);
    res.status(500).json({ message: "Error finding modules" });
  }
});

// Create a new module (instructor only)
router.post("/courses/:courseId/modules", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("Creating module with data:", { ...req.body, course: courseId });
    
    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ message: "Module name is required" });
    }
    
    const module = { ...req.body, course: courseId };
    const newModule = await modulesDao.createModule(module);
    console.log("Module created successfully:", newModule);
    res.status(201).json(newModule);
  } catch (error) {
    console.error("Error creating module:", error);
    // Send more detailed error message
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: "Error creating module", 
      details: error.message 
    });
  }
});

// Get a specific module
router.get("/:moduleId", async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await modulesDao.findModuleById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.json(module);
  } catch (error) {
    console.error("Error finding module:", error);
    res.status(500).json({ message: "Error finding module" });
  }
});

// Update a module (instructor only)
router.put("/:moduleId", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const status = await modulesDao.updateModule(moduleId, req.body);
    if (status.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes made to the module" });
    }
    const updatedModule = await modulesDao.findModuleById(moduleId);
    res.json(updatedModule);
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ message: "Error updating module" });
  }
});

// Delete a module (instructor only)
router.delete("/:moduleId", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    if (status.deletedCount === 0) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ message: "Error deleting module" });
  }
});

export default router; 
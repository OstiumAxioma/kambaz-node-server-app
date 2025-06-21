import express from 'express';
import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import { isAuthenticated, isInstructor } from "../Users/dao.js";

const router = express.Router();

// Get all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await dao.findAllCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error finding all courses:", error);
    res.status(500).json({ message: "Error finding courses" });
  }
});

// Get users for a course
router.get("/courses/:courseId/users", async (req, res) => {
  try {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  } catch (error) {
    console.error("Error finding users for course:", error);
    res.status(500).json({ message: "Error finding users for course" });
  }
});

// Create a new course (instructor only)
router.post("/courses", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const course = await dao.createCourse(req.body);
    const currentUser = req.session["currentUser"];
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    }
    res.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Error creating course" });
  }
});

// Update a course (instructor only)
router.put("/courses/:courseId", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.json(status);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course" });
  }
});

// Delete a course (instructor only)
router.delete("/courses/:courseId", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Error deleting course" });
  }
});

export default router;

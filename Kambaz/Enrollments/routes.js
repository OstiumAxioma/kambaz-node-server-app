import express from 'express';
import * as dao from "./dao.js";
import { isAuthenticated } from "../Users/dao.js";

const router = express.Router();

// Enroll a user in a course
router.post("/users/:userId/enrollments/:courseId", isAuthenticated, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    await dao.enrollUserInCourse(userId, courseId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    res.status(500).json({ message: "Error enrolling user in course" });
  }
});

// Unenroll a user from a course
router.delete("/users/:userId/enrollments/:courseId", isAuthenticated, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    await dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error unenrolling user from course:", error);
    res.status(500).json({ message: "Error unenrolling user from course" });
  }
});

export default router; 
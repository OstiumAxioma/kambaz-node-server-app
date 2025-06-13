import express from "express";
import * as assignmentDao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import { isAuthenticated, isInstructor } from "../Users/dao.js";

const router = express.Router();

// Get all assignments for a course
router.get("/courses/:courseId/assignments", async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await assignmentDao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific assignment
router.get("/assignments/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await assignmentDao.findAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new assignment (instructor only)
router.post("/courses/:courseId/assignments", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await courseDao.findCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.session.currentUser._id) {
      return res.status(403).json({ message: "Only the course instructor can create assignments" });
    }
    const assignment = { ...req.body, course: courseId };
    const newAssignment = await assignmentDao.createAssignment(assignment);
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an assignment (instructor only)
router.put("/assignments/:assignmentId", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await assignmentDao.findAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    const course = await courseDao.findCourseById(assignment.course);
    if (course.instructor.toString() !== req.session.currentUser._id) {
      return res.status(403).json({ message: "Only the course instructor can update assignments" });
    }
    const status = await assignmentDao.updateAssignment(assignmentId, req.body);
    if (status.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes made to the assignment" });
    }
    const updatedAssignment = await assignmentDao.findAssignmentById(assignmentId);
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an assignment (instructor only)
router.delete("/assignments/:assignmentId", isAuthenticated, isInstructor, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await assignmentDao.findAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    const course = await courseDao.findCourseById(assignment.course);
    if (course.instructor.toString() !== req.session.currentUser._id) {
      return res.status(403).json({ message: "Only the course instructor can delete assignments" });
    }
    const status = await assignmentDao.deleteAssignment(assignmentId);
    if (status.deletedCount === 0) {
      return res.status(400).json({ message: "Failed to delete assignment" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 
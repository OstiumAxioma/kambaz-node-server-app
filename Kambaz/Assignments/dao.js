import assignmentModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createAssignment = async (assignment) => {
  try {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return await assignmentModel.create(newAssignment);
  } catch (error) {
    console.error("Error in createAssignment:", error);
    throw error;
  }
};

export const findAssignmentsForCourse = async (courseId) => {
  try {
    return await assignmentModel.find({ course: courseId });
  } catch (error) {
    console.error("Error in findAssignmentsForCourse:", error);
    throw error;
  }
};

export const findAssignmentById = async (assignmentId) => {
  try {
    return await assignmentModel.findById(assignmentId);
  } catch (error) {
    console.error("Error in findAssignmentById:", error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, assignmentUpdates) => {
  try {
    return await assignmentModel.updateOne(
      { _id: assignmentId },
      { $set: assignmentUpdates }
    );
  } catch (error) {
    console.error("Error in updateAssignment:", error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    return await assignmentModel.deleteOne({ _id: assignmentId });
  } catch (error) {
    console.error("Error in deleteAssignment:", error);
    throw error;
  }
}; 
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findModulesForCourse = async (courseId) => {
  try {
    return await model.find({ course: courseId });
  } catch (error) {
    console.error("Error in findModulesForCourse:", error);
    throw error;
  }
};

export const findModuleById = async (moduleId) => {
  try {
    return await model.findById(moduleId);
  } catch (error) {
    console.error("Error in findModuleById:", error);
    throw error;
  }
};

export const createModule = async (module) => {
  try {
    const newModule = { ...module, _id: uuidv4() };
    return await model.create(newModule);
  } catch (error) {
    console.error("Error in createModule:", error);
    throw error;
  }
};

export const deleteModule = async (moduleId) => {
  try {
    return await model.deleteOne({ _id: moduleId });
  } catch (error) {
    console.error("Error in deleteModule:", error);
    throw error;
  }
};

export const updateModule = async (moduleId, moduleUpdates) => {
  try {
    return await model.updateOne(
      { _id: moduleId },
      { $set: moduleUpdates }
    );
  } catch (error) {
    console.error("Error in updateModule:", error);
    throw error;
  }
};
 
 
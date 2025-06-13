import Database from "../Database/index.js";
import model from "./model.js";

export function updateModule(moduleId, moduleUpdates) {
  const { modules } = Database;
  const module = modules.find((module) => module._id === moduleId);
  Object.assign(module, moduleUpdates);
  return module;
}

export function deleteModule(moduleId) {
  const { modules } = Database;
  Database.modules = modules.filter((module) => module._id !== moduleId);
}

export function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
} 

export function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}

export function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}

export function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, moduleUpdates);
}
 
 
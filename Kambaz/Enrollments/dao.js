<<<<<<< HEAD
import model from "./model.js";
=======
import Database from "../Database/index.js";
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
>>>>>>> 7c58aaf (a6 commit)

export const findCoursesForUser = async (userId) => {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
};

export const findUsersForCourse = async (courseId) => {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
};

<<<<<<< HEAD
export const enrollUserInCourse = async (userId, courseId) => {
  const enrollment = await model.create({
    user: userId,
    course: courseId,
    _id: `${userId}-${courseId}`
  });
  return enrollment;
};

export const unenrollUserFromCourse = async (userId, courseId) => {
  const result = await model.deleteOne({ user: userId, course: courseId });
  return result;
};
=======
export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  Database.enrollments = enrollments.filter(
    (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
  );
}

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

export function enrollUserInCourse(user, course) {
  return model.create({ user, course, _id: `${user}-${course}` });
}

export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}

export function enrollUserInCourse(user, course) {
  const newEnrollment = { user, course, _id: `${user}-${course}` };
  return model.create(newEnrollment);
}

export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}
>>>>>>> 7c58aaf (a6 commit)
 

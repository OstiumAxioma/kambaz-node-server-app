import model from "./model.js";

export const findCoursesForUser = async (userId) => {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
};

export const findUsersForCourse = async (courseId) => {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
};

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
 

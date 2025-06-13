import model from "./model.js";
import * as courseDao from "../Courses/dao.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return await model.create(newUser);
};

export const findAllUsers = async () => {
    return await model.find().exec();
};

export const findUsersByRole = async (role) => {
    console.log("DAO: Finding users with role:", role);
    const users = await model.find({ role: role }).exec();
    console.log("DAO: Found users:", users);
    return users;
};

export const findUserById = async (userId) => {
    return await model.findById(userId).exec();
};

export const findUserByUsername = async (username) => {
    return await model.findOne({ username: username }).exec();
};

export const findUserByCredentials = async (username, password) => {
    return await model.findOne({ username, password }).exec();
};

export const updateUser = async (userId, user) => {
    return await model.updateOne({ _id: userId }, { $set: user }).exec();
};

export const deleteUser = async (userId) => {
    return await model.deleteOne({ _id: userId }).exec();
};

export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};

export const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.status(401).json({ message: "You must be logged in to perform this action" });
  }
};

export const isInstructor = (req, res, next) => {
  if (req.session.currentUser && 
      (req.session.currentUser.role === "FACULTY" || 
       req.session.currentUser.role === "ADMIN")) {
    next();
  } else {
    res.status(403).json({ 
      message: "You must be a faculty member or administrator to perform this action",
      currentRole: req.session.currentUser?.role
    });
  }
};


import db from "../Database/index.js";
import * as courseDao from "../Courses/dao.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    db.users = [...db.users, newUser];
    return newUser;
};
export const findAllUsers = () => db.users;
export const findUserById = (userId) => db.users.find((user) => user._id === userId);
export const findUserByUsername = (username) => db.users.find((user) => user.username === username);
export const findUserByCredentials = (username, password) =>
    db.users.find( (user) => user.username === username && user.password === password );
export const updateUser = (userId, user) => (db.users = db.users.map((u) => (u._id === userId ? user : u)));
export const deleteUser = (userId) => (db.users = db.users.filter((u) => u._id !== userId));
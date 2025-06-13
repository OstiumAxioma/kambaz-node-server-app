import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Error creating user" });
        }
    };
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);  
    };
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        console.log("Finding users with role:", role); // Debug log
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }      
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);      
            return;
        }
    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);    
     };
    const updateUser = async (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }       
        // req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
          req.session["currentUser"] = currentUser;
          res.json(currentUser);
        } else {
          res.status(401).json({ message: "Unable to login. Try again later." });
        }       
    };
    const signout = async (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };    
    const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    const findCoursesForUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        if (currentUser.role === "ADMIN") {
            const courses = await courseDao.findAllCourses();
            res.json(courses);
            return;
        }
        let { uid } = req.params;
        if (uid === "current") {
            uid = currentUser._id;
        }
        const courses = await enrollmentsDao.findCoursesForUser(uid);
        res.json(courses);
    };
    const enrollUserInCourse = async (req, res) => {
        try {
            let { uid, cid } = req.params;
            if (uid === "current") {
                const currentUser = req.session["currentUser"];
                if (!currentUser) {
                    res.sendStatus(401);
                    return;
                }
                uid = currentUser._id;
            }
            const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
            res.json(status);
        } catch (error) {
            console.error("Error enrolling user in course:", error);
            res.status(500).json({ message: "Error enrolling user in course" });
        }
    };
    const unenrollUserFromCourse = async (req, res) => {
        try {
            let { uid, cid } = req.params;
            if (uid === "current") {
                const currentUser = req.session["currentUser"];
                if (!currentUser) {
                    res.sendStatus(401);
                    return;
                }
                uid = currentUser._id;
            }
            const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
            res.json(status);
        } catch (error) {
            console.error("Error unenrolling user from course:", error);
            res.status(500).json({ message: "Error unenrolling user from course" });
        }
    };
    app.get("/api/users/:uid/courses", findCoursesForUser);
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
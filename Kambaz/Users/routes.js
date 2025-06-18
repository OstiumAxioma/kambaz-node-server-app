import express from 'express';
import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
<<<<<<< HEAD

const router = express.Router();

// User CRUD operations
router.post("/users", async (req, res) => {
    try {
        const user = await dao.createUser(req.body);
        res.json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
});

router.get("/users", async (req, res) => {
    const { role, name } = req.query;
    console.log("Finding users with role:", role);
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
    const users = await dao.findAllUsers();
    res.json(users);
});

router.get("/users/:userId", async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);    
});

router.put("/users/:userId", async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
        req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }       
    res.json(currentUser);
});

router.delete("/users/:userId", async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);  
});

// Authentication routes
router.post("/users/signup", async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
        res.status(400).json({ message: "Username already taken" });
        return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
});

router.post("/users/signin", async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
=======
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
>>>>>>> 7c58aaf (a6 commit)
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }       
});

router.post("/users/signout", async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});    

router.post("/users/profile", async (req, res) => {
    const currentUser = req.session["currentUser"];
<<<<<<< HEAD
    if (!currentUser) {
        res.sendStatus(401);
        return;
    }
    res.json(currentUser);
});

// Course enrollment routes
router.get("/users/:uid/courses", async (req, res) => {
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
});

router.post("/users/:uid/courses/:cid", async (req, res) => {
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
});

router.delete("/users/:uid/courses/:cid", async (req, res) => {
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
});

export default router;
=======
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
>>>>>>> 7c58aaf (a6 commit)

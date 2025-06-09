const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
};

// 添加模块对象
const module = {
    id: "CS5610",
    name: "Web Development",
    description: "Learn modern web development technologies",
    course: "CS5610"
};

export default function WorkingWithObjects(app) {
    // 现有的 Assignment 路由
    app.get("/lab5/assignment", (req, res) => {
        res.json(assignment);
    });
    
    app.get("/lab5/assignment/title", (req, res) => {
        res.json(assignment.title);
    });
    
    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    });

    // 新增：Assignment 分数路由
    app.get("/lab5/assignment/score/:newScore", (req, res) => {
        const { newScore } = req.params;
        assignment.score = parseInt(newScore);
        res.json(assignment);
    });

    // 新增：Assignment 完成状态路由
    app.get("/lab5/assignment/completed/:newCompleted", (req, res) => {
        const { newCompleted } = req.params;
        assignment.completed = newCompleted === 'true';
        res.json(assignment);
    });

    // 新增：Module 相关路由
    app.get("/lab5/module", (req, res) => {
        res.json(module);
    });

    app.get("/lab5/module/name", (req, res) => {
        res.json(module.name);
    });

    app.get("/lab5/module/name/:newName", (req, res) => {
        const { newName } = req.params;
        module.name = newName;
        res.json(module);
    });

    app.get("/lab5/module/description/:newDescription", (req, res) => {
        const { newDescription } = req.params;
        module.description = newDescription;
        res.json(module);
    });
};
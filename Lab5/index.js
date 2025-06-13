import express from 'express';
const router = express.Router();

router.get("/lab5/welcome", (req, res) => {
  res.send("Welcome to Lab 5");
});

export default router;  
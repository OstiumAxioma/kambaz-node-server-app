import express from 'express';
const router = express.Router();

router.get("/lab5/query", (req, res) => {
  const message = req.query.message;
  res.send(`Message: ${message}`);
});

export default router;
  
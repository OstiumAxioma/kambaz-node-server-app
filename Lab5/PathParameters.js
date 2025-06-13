import express from 'express';
const router = express.Router();

router.get("/lab5/path/:message", (req, res) => {
  const message = req.params.message;
  res.send(`Message: ${message}`);
});

export default router;
  
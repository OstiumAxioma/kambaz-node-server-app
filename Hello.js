import express from 'express';
const router = express.Router();

router.get('/hello', (req, res) => {
  res.send('Life is good!');
});

router.get('/', (req, res) => {
  res.send('Welcome to Full Stack Development!');
});

export default router;
  
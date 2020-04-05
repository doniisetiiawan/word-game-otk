import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ title: 'Word Chain Game' });
});

export default router;

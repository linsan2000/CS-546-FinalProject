import {Router} from 'express';
const router = Router();
import bcrypt from 'bcryptjs';

router.get('/', async (req, res) => {
  req.session.destroy();
  res.redirect('/movies');
});

export default router;

import {Router} from 'express';
const router = Router();

router.route('/')
.get(async (req, res) => {
  req.session.destroy();
  res.redirect('/movies');
});

export default router;

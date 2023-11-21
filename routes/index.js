import movieRoutes from './movies.js';
import reviewRoutes from './reviews.js';
import userRoutes from './user.js';
import loginRoutes from './login.js';
import logoutRoutes from './logout.js';
import registerRoutes from './register.js';

const constructorMethod = (app) => {
  app.use('/movies', movieRoutes);
  app.use('/reviews', reviewRoutes);
  app.use('/user', userRoutes);
  app.use('/login', loginRoutes);
  app.use('/logout', logoutRoutes);
  app.use('/register', registerRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
  });
};

export default constructorMethod;
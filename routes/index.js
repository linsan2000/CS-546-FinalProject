import movieRoutes from './movies.js';
import reviewRoutes from './reviews.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
  app.use('/movies', movieRoutes);
  app.use('/reviews', reviewRoutes);
  app.use('/users', userRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

export default constructorMethod;
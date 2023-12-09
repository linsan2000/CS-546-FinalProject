import adminRoutes from './admin.js';
import home from './home.js';
import userRoutes from './user.js'

const constructorMethod = (app) => {
  app.use('/', home);
  app.use('/admin', adminRoutes);
  app.use('/user', userRoutes)
  app.use('*', (req, res) => {
    res.status(404).send('404')
  });
};

export default constructorMethod;
import adminRoutes from './admin.js';
import home from './home.js';

const constructorMethod = (app) => {
  app.use('/', home);
  app.use('/admin', adminRoutes);
  app.use('*', (req, res) => {
    res.status(404).send('404')
  });
};

export default constructorMethod;
import loginRoutes from './login.js';
import logoutRoutes from './logout.js';
import registerRoutes from './register.js';
import adminRoutes from './admin.js';
import protectedRoutes from './protected.js';

const constructorMethod = (app) => {
  app.use('/register', registerRoutes);
  app.use('/login', loginRoutes);
  app.use('/admin', adminRoutes);
  app.use('/protected', protectedRoutes);
  app.use('/logout', logoutRoutes);

  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

export default constructorMethod;
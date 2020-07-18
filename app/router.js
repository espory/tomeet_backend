'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  let jwt = app.middleware.jwt({app})
  router.get('/', controller.home.index);
  router.post('/user/login', controller.user.login);
  router.post('/user/sendcode', controller.user.sendcode);
  router.post('/user/register', controller.user.register);
  router.get('/user/info', jwt ,controller.user.info);

};

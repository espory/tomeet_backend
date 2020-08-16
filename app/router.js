'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io} = app;
  let jwt = app.middleware.jwt({app})

  router.post('/robot', controller.robot.index);

  router.post('/user/login', controller.user.login);
  router.post('/user/sendcode', controller.user.sendcode);
  router.post('/user/register', controller.user.register);
  router.get('/user/getInfo', jwt ,controller.user.getInfo);
  router.post('/user/updateInfo', jwt ,controller.user.updateInfo);


  io.of('/').route('tomeet', io.controller.default.tomeet)
  io.of('/').route('sendMessage', io.controller.default.sendMessage)


};

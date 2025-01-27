'use strict';

// /** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.jwt = {
  enable: true,
  package: "egg-jwt"
};

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};
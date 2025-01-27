/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594256127335_991';

  // add your middleware config here
  config.middleware = [];

  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ['connection'],
        packetMiddleware: ['packet'],
      },
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security:{
      csrf:{
        enable:false,
      }
    },
    mongoose:{
      client:{
        url:'mongodb://localhost:27017/tomeet',
        options:{}
      }
    }
  };
};

exports.jwt = {
  secret: "123456"
};



'use strict';

const BaseController = require('./base');

// const BaseController = require('./base').Controller;

class RobotController extends BaseController {
  async index() {
    const { ctx } = this;
    const {text, id} = ctx.request.body;
    let res = await this.service.tools.robotMsg(text, id);
    this.success(res);

  }
}

module.exports = RobotController;

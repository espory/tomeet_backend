'use strict';

const Controller = require('egg').Controller;

// const BaseController = require('./base').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';

  }
  async demoinfo() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
    // this.message('成功信息');
  }
}

module.exports = HomeController;

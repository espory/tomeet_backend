//逻辑层controller的父类 ， 抽象一些公用方法

const Controller = require('egg').Controller;

class BaseController extends Controller{
    //公用代码抽象
    message(message){
        this.ctx.body = {
            code:0,
            message
        }
    }
    success(message){
        this.ctx.body = {
            code:0,
            message
        }
    }
    error(message, code=-1){
        this.ctx.body = {
            code,
            message
        }
    }

}

module.exports = BaseController
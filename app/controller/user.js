'use strict';

const BaseController = require('./base');
const utility = require("utility")//密码加密


class UserController extends BaseController {
  async index() {
    const { ctx } = this;
    const user = await this.service.tools.checkPhoneNum(ctx.state.phoneNum);
    this.success(user);
  }

  async login(){
    const { ctx ,app} = this;
    const {phoneNum, password} = ctx.request.body;
    let psw = utility.md5(password);
    let user = await this.service.tools.checkPhoneNum(phoneNum)
    if(!user||user.password!==psw){
      return this.error('账号或密码错误');
    } else {
      const {nickname} = user;
      const token = app.jwt.sign({
        nickname,
        phoneNum,
        id:user._id
      }, app.config.jwt.secret,{
        expiresIn:'1h'
      });
      return this.success({'token':token});
    }
  }

  async register(){
    const { ctx } = this;
    const {phoneNum, password, code} = ctx.request.body;

    if(code!==ctx.session.phonecode||phoneNum!==ctx.session.phoneNum){
      return this.error('请输入正确验证码');
    }
    if(await this.service.tools.checkPhoneNum(phoneNum)){
      return this.error('该手机号已被注册');
    }

    
    let ret = await ctx.model.User.create({
      phoneNum:phoneNum,
      password: utility.md5(password),
      nickname:'未命名'
    })

    if(ret._id){
      this.success('注册成功');
    }


  }

  async sendcode() {
      //controller 写业务逻辑，通用的逻辑， 抽象成service
    const { ctx } = this;
    // const phoneNum = ctx.query.phoneNum; Get请求参数
    const {phoneNum} = ctx.request.body;  //Post请求参数

    let user = await this.service.tools.checkPhoneNum(phoneNum)
    if(user){
      return this.error('该手机号已被注册');
    }

    const phonecode = Math.random().toString().slice(2,6);  //四位验证码
 
    if("lastSendTime" in ctx.session){
      let dis = (new Date()).getTime()-ctx.session.lastSendTime;
      if(Math.floor(dis/(60*1000))<=5){
        return this.error('发送时间小于5分钟');
      }
    }

    let hasSend = await this.service.tools.sendCode(phoneNum, phonecode);

    if(hasSend){
      ctx.session.phonecode = phonecode;
      ctx.session.phoneNum = phoneNum;
      ctx.session.lastSendTime = (new Date()).getTime();
      this.success('短信发送成功，请注意查收');
    }
    else{
      this.error('短信发送失败');
    }
  }

  async info() {
    this.success('测试');
  }

}

module.exports = UserController;

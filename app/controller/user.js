'use strict';

const BaseController = require('./base');
const utility = require("utility")//密码加密


class UserController extends BaseController {
  async index() {
    const { ctx } = this;
    const user = await this.service.tools.checkPhoneNum(ctx.state.phoneNum);
    this.success(user);
  }

  async login() {
    const { ctx, app } = this;
    const { phoneNum, password } = ctx.request.body;
    let psw = utility.md5(password);
    let user = await this.service.tools.checkPhoneNum(phoneNum)
    if (!user || user.password !== psw) {
      return this.error('账号或密码错误');
    } else {

      const token = await this.service.tools.getToken(user);
      return this.success({ 'token': token });
    }
  }

  async register() {
    const { ctx } = this;
    const { phoneNum, password, code } = ctx.request.body;
    // if (code !== ctx.session.phonecode || phoneNum !== ctx.session.phoneNum) {

    if (phoneNum !== ctx.session.phoneNum) {
      return this.error('请输入正确验证码');
    }
    if (await this.service.tools.checkPhoneNum(phoneNum)) {
      return this.error('该手机号已被注册');
    }


    let ret = await ctx.model.User.create({
      phoneNum: phoneNum,
      password: utility.md5(password),
      nickName: '未命名',
      grade: '研一',
      gender: '男生',
      academy: '计算机科学与技术学院',
    })


    if (ret._id) {
      const token = await this.service.tools.getToken(ret);
      return this.success({ 'token': token, 'message': '注册成功' });
    }
  }

  async sendcode() {
    //controller 写业务逻辑，通用的逻辑， 抽象成service
    const { ctx } = this;
    // const phoneNum = ctx.query.phoneNum; Get请求参数
    const { phoneNum } = ctx.request.body;  //Post请求参数

    let user = await this.service.tools.checkPhoneNum(phoneNum)
    if (user) {
      return this.error('该手机号已被注册');
    }

    const phonecode = Math.random().toString().slice(2, 6);  //四位验证码

    if ("lastSendTime" in ctx.session) {
      let dis = (new Date()).getTime() - ctx.session.lastSendTime;
      if (Math.floor(dis / (60 * 1000)) <= 5) {
        return this.error('发送时间小于5分钟');
      }
    }

    let hasSend = await this.service.tools.sendCode(phoneNum, phonecode);
    if (hasSend) {
      ctx.session.phonecode = phonecode;
      ctx.session.phoneNum = phoneNum;
      ctx.session.lastSendTime = (new Date()).getTime();
      this.success('短信发送成功，请注意查收');
    }
    else {
      this.error('短信发送失败');
    }
  }

  async getInfo() {
    const { ctx, app } = this;

    const token = ctx.request.header.authorization.replace('Bearer ', "")
    let res = await app.jwt.verify(token, app.config.jwt.secret)

    this.success(res);
  }

  async updateInfo() {
    const { ctx } = this;
    let info = ctx.request.body;
    const user = await this.service.tools.updateUserInfo(info)

    if(user){
      this.success('更新成功');
    }else{
      this.error('更新失败')
    }
  }

}

module.exports = UserController;

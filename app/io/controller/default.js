// {app_root}/app/io/controller/default.js
'use strict';

const { io } = require('../../../config/plugin');

const Controller = require('egg').Controller;

global.socketQueue = new Array();
global.toMeetUser = {};
class DefaultController extends Controller {
  async tomeet() {
    const { ctx, app } = this;
    const message = ctx.args[0];

    console.log(message.userInfo.nickName)
    let nowSocketId = ctx.socket.id;

    const nsp = app.io.of('/');

    let toMeetId = '';

    if(global.socketQueue.length!==0&&(global.socketQueue.slice(-1) in nsp.sockets)){
      toMeetId = global.socketQueue.pop()
      global.toMeetUser[toMeetId] = nowSocketId;
      global.toMeetUser[nowSocketId] = toMeetId;
      //建立连接

      nsp.sockets[toMeetId].emit('toMeet-Suceess',{toMeetUserId:nowSocketId});
      ctx.socket.emit('toMeet-Suceess',{toMeetUserId:toMeetId});

    }else{
      socketQueue.unshift(nowSocketId)
    }

    console.log("socketQueue:", global.socketQueue)
    console.log("toMeetUser:", global.toMeetUser)
    
    // console.log(socketQueue)
    // if(!(nowSocketId in socketQueue)){
    //   socketQueue.unshift(nowSocketId)
    //   console.log(socketQueue)
    // }
    // console.log('socaket-id: ', ctx.socket.id)
    // console.log(Object.keys(nsp.sockets))
    // nsp.sockets[ctx.socket.id].emit('res','!!!!!!!!!!!!!!!!!!')

    // await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
  }

  async sendMessage() {
    const { ctx, app } = this;
    const msg = ctx.args[0];
    const nsp = app.io.of('/');
    let nowSocketId = ctx.socket.id;
    // console.log('global.toMeetUserId:',global.toMeetUser)
    // console.log(Object.keys(nsp.sockets))
    
    let toMeetId = global.toMeetUser[nowSocketId];

    nsp.sockets[toMeetId].emit('getMessage',{message:msg.message});


    // let nowSocketId = ctx.socket.id;

    // const nsp = app.io.of('/');

    // let toMeetId = '';

    // if(global.socketQueue.length!==0&&(global.socketQueue.slice(-1) in nsp.sockets)){
    //   toMeetId = global.socketQueue.pop()
    //   global.toMeetUser[toMeetId] = nowSocketId;
    //   global.toMeetUser[nowSocketId] = toMeetId;
    //   //建立连接
    //   nsp.sockets[toMeetId].emit('toMeet-Suceess',{code:0, toMeetId:nowSocketId});
    //   ctx.socket.emit('toMeet-Suceess',{code:0, toMeetId:toMeetId});
    // }else{
    //   socketQueue.unshift(nowSocketId)
    // }

    // console.log("socketQueue:", global.socketQueue)
    // console.log("toMeetUser:", global.toMeetUser)
    
    // console.log(socketQueue)
    // if(!(nowSocketId in socketQueue)){
    //   socketQueue.unshift(nowSocketId)
    //   console.log(socketQueue)
    // }
    // console.log('socaket-id: ', ctx.socket.id)
    // console.log(Object.keys(nsp.sockets))
    // nsp.sockets[ctx.socket.id].emit('res','!!!!!!!!!!!!!!!!!!')

    // await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
  }
}

module.exports = DefaultController;
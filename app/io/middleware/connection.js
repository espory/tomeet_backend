module.exports = app => {
  return async (ctx, next) => {

    // ctx.socket.emit('res', 'connected!');
    await next();
    // execute when disconnect.

    //从socketQueue删除
    idIndex = global.socketQueue.indexOf(ctx.socket.id)
    if (idIndex !== -1) {
      global.socketQueue.splice(ctx.socket.id, 1)
    }

    //通知对方我已经离开

    let nowSocketId = ctx.socket.id

    console.log(nowSocketId," ----- 离开")
    if (nowSocketId in global.toMeetUser) {

      const nsp = app.io.of('/');
      let toMeetId = global.toMeetUser[nowSocketId];
      nsp.sockets[toMeetId].emit('toMeet-Disconnection', { code: -1, message: "对方已离开" });

      delete global.toMeetUser[nowSocketId];
      delete global.toMeetUser[toMeetId];



    }
  };
};

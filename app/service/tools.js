'use strict';
const Service = require('egg').Service

const APIKEY = '4f4d92fb2abc91d8f71331be5e3e88c9'
const single_send_url = "https://sms.yunpian.com/v2/sms/single_send.json"

class ToolsService extends Service {

    async sendCode(phoneNum, code) {
        const parmas = {
            "apikey": APIKEY,
            "mobile": phoneNum,
            "text": `【陌生人】您的验证码是${code}。如非本人操作，请忽略本短信`,
        }

        const result = await this.ctx.curl(single_send_url, {
            // 必须指定 method
            method: 'POST',
            data: parmas,
            timeout: 2000,
            dataType: 'json',
          });
        if(result.data.code===0){
              return true;
        }
        else{
            return false;
        }
    }

    async checkPhoneNum(phoneNum){
        const user =  await this.ctx.model.User.findOne({phoneNum:phoneNum});
        return user;

    }
}

module.exports = ToolsService;

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
        if (result.data.code === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    async getToken(user) {

        const { app } = this;

        const { _id, nickName, academy, grade, gender } = user;

        const token = app.jwt.sign({
            id: _id,
            nickName,
            academy,
            grade,
            gender
        }, app.config.jwt.secret, {
            expiresIn: '10h'
        });

        return token;
    }

    async checkPhoneNum(phoneNum) {
        const user = await this.ctx.model.User.findOne({ phoneNum: phoneNum });
        return user;
    }

    async updateUserInfo(info) {
        let _id = info.id;
        let userInfo = {
            nickName: info.nickName,
            academy: info.academy,
            grade: info.grade,
            gender: info.gender
        }
        const user = await this.ctx.model.User.updateOne({ _id }, userInfo)

        console.log(666)
        return user;
    }

    async robotMsg(text, id) {


        let parmas = {
            "perception":
            {
                "inputText":
                {
                    "text": text
                },

                "selfInfo":
                {
                    "location":
                    {
                        "city": "济南",
                        "province": "长清区",
                    }
                }
            },

            "userInfo":
            {
                "apiKey": "37b355da4ccd4cb4a0f88828ede18e14",
                "userId": id
            }
        }

        // response = requests.post('http://openapi.tuling123.com/openapi/api/v2', data = req, headers = { 'content-type': 'application/json' })

        const single_send_url = 'http://openapi.tuling123.com/openapi/api/v2'
        const result = await this.ctx.curl(single_send_url, {
            // 必须指定 method
            method: 'POST',
            data: JSON.stringify(parmas),
            // timeout: 2000,
            dataType: 'json',
            // 'Content-Type': 'application/json'
        });
        return result.data.results[0].values.text
    }
}

module.exports = ToolsService;



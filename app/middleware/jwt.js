//中间件

module.exports = ({app})=>{
    return async function verify(ctx, next){
        if(!('authorization' in ctx.request.header)){
            return ctx.body = {
                code:-10,
                message:'尚未登录，请登录后访问'
            }
        }

        const token = ctx.request.header.authorization.replace('Bearer ',"")
        

        try{
            let ret = await app.jwt.verify(token, app.config.jwt.secret)
            ctx.state.phoneNum = ret.phoneNum;
            ctx.state.userId = ret.id;
            await next()
        }catch(err){
            if(err.name==='TokenExpiredError'){
                ctx.state.phoneNum = '';
                ctx.state.userId = '';
                return ctx.body = {
                    code:-5,
                    message:'登录信息已过期，请重新登录'
                }
            }
            if(err.name === 'JsonWebTokenError'){
                ctx.state.phoneNum = '';
                ctx.state.userId = '';
                return ctx.body = {
                    code:-5,
                    message:'无效登录'
                }
            }

            console.log(err)
        }
    }
}
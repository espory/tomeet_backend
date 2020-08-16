module.exports = (app)=>{
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        _v:{type:Number, select:false},
        phoneNum:{type:String, require:true},
        password:{type:String, require:true},
        nickName:{type:String, require:true},
        grade:{type:String, require:false},
        academy:{type:String, require:false},
        gender:{type:String, require:false},

    },{timestamps:true})


    return mongoose.model('User', UserSchema, 'user');
    
    //需要把数据库多余的索引删除
}
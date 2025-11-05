const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({ name:String, email:{type:String,unique:true}, password:String, role:{type:String,default:'admin'} });
module.exports = mongoose.model('User', UserSchema);

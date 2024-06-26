const mongoose = require('mongoose');
userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required:true,
        unique:true},
    password:String,
    phone:Number,
    email:String
})

module.exports = mongoose.model('User',userSchema);
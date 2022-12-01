// mongodb connection
// 1.import mongoose

const mongoose=require('mongoose')

// 2.define connection string
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('Mongodb connceted succefully....')
})

// 3.creat a model to store data of bank-singular name ,first letter is capital

const User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]

})

// 4.to use user in other file - we have to export it

module.exports={
    User
}
// import db
const db=require('./db')
// import jsonwebtoken
const jwt=require('jsonwebtoken')

// login defenition

const login=(acno,password)=>{
    // 1.serach acccno,password in mongodb-findOne()
   return db.User.findOne({acno,
        password
    }).then((result)=>{
        console.log(result);
        if(result){
            // genarate token
            const token=jwt.sign({
                currentAcno:acno
            },"secretkey12345")
            return{
                message:'Login Succesfully',
                status:true,
                statusCode:200,
                username:result.username,
                token,
                currentAcno:acno
            }

        }
        else{
            return{
                message:'Invalid Account Number/password!!',
                status:false,
                statusCode:404
            }
        }
    })
}

// register
const register=(acno,pswd,uname)=>{
    // 1.search acno in db if yes
    return db.User.findOne({
        acno
    }).then((result)=>{
        // 2.if yes response:alredy exist
        if(result){
            return{
                message:'Alerdy existing User',
                status:true,
                statusCode:404
            }

        }

    else{
        let newUser=new db.User({
            acno,
            username:uname,
            password:pswd,
            balance:0,
            transaction:[]        
        })
        newUser.save()
        return{
            message:'Register Succfully',
            status:true,
            statusCode:200
        }

    }
    })
}
// deposit
const deposit=(req,acno,password,amount)=>{
    var amt=Number(amount)
    // 1.serach acccno,password in mongodb-findOne()
   return db.User.findOne({acno,
        password
    }).then((result)=>{
        if (acno!=req.currentAcno) {
            return{
                message:'Permision Denied!!',
                status:false,
                statusCode:404
            }

        }
        console.log(result);
        if(result){
            result.balance+= amt
            result.transaction.push({
                amount,
                type:'CREDIT'
            })
            result.save()
            return{
                message:`${amount} deposited successfully and new balance is ${result.balance}`,
                status:true,
                statusCode:200
            }

        }
        else{
            return{
                message:'Invalid Account Number/password!!',
                status:false,
                statusCode:404
            }
        }
    })
}

// withdrawl

const withdrawl=(req,acno,password,amount)=>{
    var amt=Number(amount)
    // 1.serach acccno,password in mongodb-findOne()
   return db.User.findOne({acno,
        password
    }).then((result)=>{
        if (acno!=req.currentAcno) {
            return{
                message:'Permision Denied!!',
                status:false,
                statusCode:404
            }

        }

        console.log(result);
        // if(result){
            // check suffient balance
            if (result.balance>=amt) {
                result.balance-=amt
                result.transaction.push({
                    amount,
                    type:'DEBIT'
                })
                result.save()
                return{
                    message:`${amount} withdraw successfully and new balance is ${result.balance}`,
                    status:true,
                    statusCode:200
                }
    
            }

        // }
        else{
            return{
                message:'Insufficient balance',
                status:false,
                statusCode:404
            }
        }
    })
}

// transaction function

const transaction=(acno)=>{
    return db.User.findOne({
        acno
        
    }).then((result)=>{
        if (result) {
            return{
                status:true,
                statusCode:200,
                transaction:result.transaction
    
            }
        }
        else{
            return{
                message:'Invalid Account Number/password!!',
                status:false,
                statusCode:404
            }

        }
})
}

// to delete acno from db
const deleteAcno=(acno)=>{
    return db.User.deleteOne({
        acno
    }).then((result)=>{
        if (result) {
            return{
                message:`Account ${acno} Deleted Successfully`,
                status:true,
                statusCode:200
 
            }
        } else {
            return{
                message:'Invalid Account Number/password!!',
                status:false,
                statusCode:404
    }

        }
    })
}
module.exports={
    login,register,deposit,withdrawl,transaction,deleteAcno
}

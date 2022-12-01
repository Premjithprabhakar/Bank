// import express 
const express=require('express')

// import data service
const dataService=require('./services/data.service')

// import cors
const cors=require('cors')

// import jsonwebtoken
const jwt=require('jsonwebtoken')


// create server app using express
const app=express()

// to define origin using cors
app.use(cors({
  origin:'http://localhost:4200'
}))

// set up port for server
app.listen(3000,()=>{
    console.log('Server started at 3000');
})



// resolve client http request
// app.get('/',(req,res)=>{
//     res.send('get request..')
// })

// app.post('/',(req,res)=>{
//     res.send('post request')
// })

// app.put('/',(req,res)=>{
//     res.send('put request')
// })

// app.patch('/',(req,res)=>{
//     res.send('patch request')
// })

// app.delete('/',(req,res)=>{
//     res.send('delete request')
// })


// Application specific middileware
const appMiddleware=(req,res,next)=>{
  console.log('Application specific middileware');
  next()
}
// to use entire application
app.use(appMiddleware)

// parse json
app.use(express.json())

// bank server api-request resolveing
//jwt token verification middleware
const jwtMiddleware=(req,res,next)=>{
  console.log('Router specific Middleware');
  // 1.get token from request header in acces-token
  const token =req.headers['access-token']
  // 2.verify token using verify method in jsonwebtoken
  try{
    const data=jwt.verify(token,"secretkey12345")
    // assigning login user acno to current acno
    req.currentAcno=data.currentAcno
    next()
  }
  catch{
    res.status(422).json({
      status:false,
      message:'please  log in'
    })
  }

}
// login API-resolve

app.post('/login',(req,res)=>{
  console.log(req.body);
  dataService.login(req.body.acno,req.body.pswd).then((result) => {
    res.status(result.statusCode).json(result)
  })
})

// register 

app.post('/register',(req,res)=>{
  console.log(req.body);
  dataService.register(req.body.acno,req.body.pswd,req.body.uname).then((result) => {
    res.status(result.statusCode).json(result)
  })
})

// deposit
app.post('/deposit',jwtMiddleware,(req,res)=>{
  console.log(req.body);
  dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount).then((result) => {
    res.status(result.statusCode).json(result)
  })
})

// withdrawl
app.post('/withdrawl',jwtMiddleware,(req,res)=>{
  console.log(req.body);
  dataService.withdrawl(req,req.body.acno,req.body.pswd,req.body.amount).then((result) => {
    res.status(result.statusCode).json(result)
  })
})

// transaction Api-reslove -roter specific middleware
app.get('/transction/:acno',jwtMiddleware,(req,res)=>{
  console.log(req.params);
  dataService.transaction(req.params.acno).then((result) => {
    res.status(result.statusCode).json(result)
  })
})

// deleteAcno api

app.delete('/deleteAcno/:acno',jwtMiddleware,(req,res)=>{
  dataService.deleteAcno(req.params.acno).then((result) => {
    res.status(result.statusCode).json(result)
  })
})

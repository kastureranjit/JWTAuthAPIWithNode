const express = require('express');
const jwt = require('jsonwebtoken');
const login = require('./routes/loginroutes');
const bodyParser = require('body-parser');
const app = express();

//Allow json to be accepted 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept");
    next();
});

const router = express.Router();
app.get('/api',(req,res) =>{
    res.json({
        message:'Welcome to the API'
    });
});

app.post('/api/posts',verifyToken, (req,res) => {
    jwt.verify(req.token,'secretkey',(err,authData) =>{
      if(err){
        res.sendStatus(403);
      } else {
        res.json({
            message:'Post created...',
            authData
        });
      }   
    });
    
});

app.post('/api/login', (req,res)=>{
  // Authenticating user with DB
  /* login.authUser(req.body.userName,req.body.password);   */
   const returnedData = login.authUser(req,res);  
  //Mock user
  const user = {
      id:1,
      username:'elixia',
      email:'elxiatech.com'
  }
  /* res.send({
   // JSON.stringify(resultData);
}) */
    //var jsonData = JSON.parse(JSON.stringify(res));
   console.log("Data returned is: "+returnedData);
/*   jwt.sign({user:user}, 'secretkey', { expiresIn:'30s' } ,(err,token)=>{
    res.json({
        token
    })
  }); */ 
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req,res,next){
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}
app.listen(5000,()=>console.log('Server started on port 5000'));
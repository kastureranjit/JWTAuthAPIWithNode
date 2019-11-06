const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'speed'
});
connection.connect(function(err){
    if(!err){
        console.log('Database is connected...');
    } else {
        console.log('error connecting database');
    }
});

 authUser =  function(req,res,next){     
    const username = req.body.username;
    const password = req.body.password;
    if(typeof username=='' || typeof username=='undefined' || typeof password=='' || typeof password=='undefined'){
        res.json({
            "code":204,
            "success":"Please send username and password"
        })
    } else {
        connection.query('select * from user where username = ? AND isdeleted=0',[username],
        function(error, results, fields){
            if(error){
                res.json({
                    "code":400,
                    "failed":"error occured"
                })
            } else {
                // console.log("The solution is: ", results);
                if(results.length > 0){ 
                    
                // dataArray.push(arraynew);
                /*   res.json({ 
                        "code":200, 
                        "data":results, 
                        "success":"login successfull"
                    });   */
                    
                    const user = {
                        username:results[0]['username'],
                        userkey:results[0]['userkey']
                    } 
                    //console.log("Data is: "+results[0]['username']);
                    jwt.sign({user}, 'secretkey', { expiresIn:'30s' } , (err,token)=>{
                        res.json({
                            token
                        })
                    }); 
                } else { 
                    res.json({
                        "code":204,
                        "success":"Email and password does not match"
                    });
                }
            }
        }
        )
    }
}

module.exports = {
    authUser
  };
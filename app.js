const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb')

const url = 'mongodb+srv://sabelo:sabelotest@cluster0-vqbas.mongodb.net/test?retryWrites=true&w=majority';
const app = express()

app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
 

app.get('/signup', (req, res)=>{
    res.sendFile(path.join(__dirname+'/public/create-profile.html'))
    
})


app.post('/create-profile',(req, res, next)=>{
    const userObj = {
        email: req.body.email,
        name : req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        degree: req.body.degree,
        favouriteCourse: req.body.course,
        password: req.body.psw
    }

    console.log(userObj)
    insertToDatabase(userObj)
    res.redirect('/login')
})

app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname+'/public/login.html'))
})

app.post('/logging_in',(req, res)=>{
    
    //login details from user
    const userLoginObj = {
        email : req.body.email,
        password: req.body.psw
    }

    //find user in database
    MongoClient.connect(url,{useNewUrlParser:true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("UserProfile");
        dbo.collection("AuthSystem_users").find(userLoginObj).toArray(function(err, result) {
        if (err) throw err;
           
               //if user is found in database
                if((result.length) > 0){ 
                    console.log('This user is logged in ' + JSON.stringify(result)) 
                    res.redirect('/login_successful') 
                }
                else{
                    res.redirect('/login_failed')
                }

            db.close()
        });
    });  
})



app.get('/login_failed', (req, res)=>{
    res.json({msg : 'login failed'})
})
app.get('/login_successful', (req, res)=>{
    res.json({msg : 'login successful!'})
})



function insertToDatabase (myobj){
  MongoClient.connect(url,{useNewUrlParser:true}, function(err, db) {
    if (err) throw err;
    var dbo = db.db("UserProfile");

    dbo.collection("AuthSystem_users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  }); 
}

app.listen(8000)
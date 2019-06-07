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
    const userLoginObj = {
        email : req.params.email,
        password: req.body.psw
    }
   
    //if user is found in database
    if((findUserinDatabase(userLoginObj).length) > 0){  
        res.redirect('/login_successful') 
    }
    else{
        res.redirect('/login_failed')
    }

    console.log(userLoginObj)
})

app.get('/login_failed', (req, res)=>{
    res.json({msg : 'login failed'})
})
app.get('/login_successful', (req, res)=>{
    res.json({msg : 'login successful!'})
})



function findUserinDatabase(query){
    let userArr = []; 
    MongoClient.connect(url,{useNewUrlParser:true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("UserProfile");
        //var query = { address: "Park Lane 38" };
        dbo.collection("AuthSystem_users").find(query).toArray(function(err, result) {
          if (err) throw err;
          userArr = result;
          db.close();
        });
      });

    return userArr
}

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
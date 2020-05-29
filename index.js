const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var c = 0;//This line will always be executed when server is restarted so the count will be altered evvery time the server restarts
//count of post will be accurate if the server is kept running since the time of the first post being posted

mongoose.connect("mongodb://localhost:27017/usersDB",{ useNewUrlParser: true ,  useUnifiedTopology: true })
const app = express();
//
//
//signup Schema
const signupSchema = new mongoose.Schema({
  username: String,
  pass: String,
})
//model for sign up

const postSchema = new mongoose.Schema({
  post: String,
  count: Number
})

const posts = mongoose.model("posts",postSchema)
const users = mongoose.model("users",signupSchema);

app.use(bodyParser.urlencoded({extended: true}));

//home page
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html")
})


//signup page both get and post
app.get("/signup",function(req,res){

  res.sendFile(__dirname +"/signup.html");
})

app.post("/signup",function(req,res){

  res.sendFile(__dirname +"/signup.html");



})//closing app.post



//login page both get and post
app.get("/login",function(req,res){

  res.sendFile(__dirname+"/login.html");
})
app.post("/login",function(req,res){

  res.sendFile(__dirname+"/login.html");
})



//view page both get and post
app.post("/newpost/user",function(req,res){

  c = c + 1;
  console.log(req.body.newpost);
  const applicant = new posts({
    post: req.body.newpost,
    count: c
  });

  applicant.save();
  res.sendFile(__dirname+"/saved.html")

})

app.get("/viewposts",function(req,res){
  posts.find(function(err,data){
    if(err){
      console.log(err);
      res.send("Please try again!!")
    }
    else{
    res.send(data)
  }
})
})

app.post("/viewposts",function(req,res){
  posts.find(function(err,data){
    if(err){
      console.log(err);
      res.send("Please try again!!")
    }
    else{
    res.send(data)
  }
})
})






//home page after login<<<this will only be post
app.post("/signup/homepage",function(req,res){
  var userName = req.body.username;
  var pass1 = req.body.pass1;

//checking for empty username and password
if(userName===""||pass1===""){//opening if for empty username and password
  res.send("Empty fields not accepted, please try again")
}//closing if for empty username and password
else{//opening else for empty username and password
   users.find({username: userName},'username',function(err,data){//opening function of find
     if(err){//opening if err
       console.log(err);
     }//closing if err
     else{//opening else err
       const data1 = JSON.stringify(data)
       console.log(data1.length);
       if(data1.length==2){
       console.log("OK");


       // else{//opening else to add to db
         const applicant =new users( {//opening doc
           username: userName,
           pass: pass1
         })//closing DOC
         applicant.save()
         res.sendFile(__dirname+"/homepage.html")
         // users.insertOne(applicant,function(err){//opening funct of insert
         //   if(err){
         //     console.log(err);
         //     res.send("Please try again")
         //   }
         //   else{
         //     console.log("successfully added a user");
         //     res.sendFile(__dirname+"/homepage.html")
         //   }
         //
         // })//closing funct of insert
       // }//closing else to add to db
     }//closing length checking
     else{
       res.send("Username already taken, please try again!!");
     }



     }//closing else err

   }//closing function of find
 )//closing find
}//closing else for empty username and password


})//closing app.post



app.post("/login/homepage",function(req,res){//opening app.post func
  var userName = req.body.username;
  var pass = req.body.pass1;
  if(userName===""||pass===""){//open
    res.send("Empty fields not accepted, please try again!!")
  }//close
  else{//open

  users.find({username: userName},function(err,data){//opening find func
    if(err){//open err
      console.log(err);
    }//close err
    else{//open else
      const data1 = JSON.stringify(data);
      console.log(data1.length);
      if(data1.length===2){
        res.send("no user found, please create an account first. To create an account go to sign up page")
      }
      else{//open else for checking password
        console.log(data);
        data.forEach(function(users){//opening data for each func
          var passcheck = users.pass;
          if(passcheck===pass){//opening pass check

            res.sendFile(__dirname+"/homepage.html")

          }//clsoing pass check
          else{
            res.send("You have entered a wrong password, please try again")
          }
        })//closing data for each func + method
      }//close else for checking password


    }//close else
  })//closing find func + method
}//close


})//closing app.post func + method

app.post("/newpost",function(req,res){
  res.sendFile(__dirname+"/posts.html")
})







app.listen(3000,function(){
  console.log("Server running on port 3000!");
})

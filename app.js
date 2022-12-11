//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
const { lowerCase } = require("lodash");
const aboutContent = "My name is Usman Ali creator of DAILY GENERAL. I'm student of Computer Science as well as Mern Stack developer and also I have 6 month experience as Mern Stack Developer. I belong to Capital of PAKISTAN ISLAMABAD";
const contactContent = "You can contact us through Facebook, Twitter, Instagram etc. please only contact when need otherwise don't disturb us";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);
const schema  = new mongoose.Schema({
  name:String,
  content : String
});


app.get('/',function(req,res){
  async function home(){
  await mongoose.connect("mongodb+srv://usman:123@cluster0.xrhc2gw.mongodb.net/log");
  const collection = await new mongoose.model("root",schema);
  await collection.find().then(function(result){
    res.render("home", {posts:result});
  }).catch(function(err){
    console.log(err);
  });
  await mongoose.connection.close();
  }
  home();
});


app.get('/about',function(req,res){
  res.render('about',{aboutcont: aboutContent});
})
app.get('/contact',function(req,res){
  res.render('contact',{contactcont: contactContent});
})
app.post('/about',function(req,res){
  res.redirect("/about");
});


app.get("/compose",function(req,res){
  res.render('compose');
});

app.post('/compose',function(req,res){
  const title = req.body.postTitle;
  const postBody =req.body.postBody;
  async function compose(){
  await mongoose.connect("mongodb+srv://usman:123@cluster0.xrhc2gw.mongodb.net/log");
  const collection = await new mongoose.model("root",schema);
  const item = new collection({
    name: title,
    content: postBody
  });
  await collection.insertMany(item);
  res.redirect('/');
  mongoose.connection.close();
}
compose();
// const post = {
    //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };
  // arr.push(post);
  // res.redirect('/');
});




let shorttitle;
app.get("/posts/:topic", function(req,res){
  async function posts(){
    await mongoose.connect("mongodb+srv://usman:123@cluster0.xrhc2gw.mongodb.net/log");
    const collection = new mongoose.model("root",schema);
    collection.find().then(function(result){
      result.forEach(function(r){
        let root = lodash.lowerCase(req.params.topic);
        let name_db = lodash.lowerCase(r.name);
        if(name_db == root){
          res.render("post",{title: r.name, content: r.content});
        }
      });
    }).catch(function(err){
      console.log(err);
    });
  }
  posts();
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});

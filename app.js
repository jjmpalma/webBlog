var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//connection to mongoDB
mongoose.connect("mongodb://localhost:27017/blog1", { useNewUrlParser: true, useUnifiedTopology: true });

//express config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
var port = 3000;

//db schema setup
var blogSchema = mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);


/*
//adding some data to the db
Blog.create({
   title: "Blog alcachofa 1",
   image: "https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&h=350",
   body: "rlmv 4jov nt4ovnto4vntojvnjor vjrv v v +tv"
});
*/

//====== RESTFUL ROUTES ======
// INDEX 
app.get("/", function (req, res) {
   res.redirect("/blogs");
})

app.get("/blogs", function (req, res) {
   Blog.find({}, function (err, blogs) {
      if (err) {
         console.log("err");
      } else {
         res.render("index", { blogs, blogs });
      }
   })
})

//SHOW 
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err) {
         res.redirect("/blogs");
      } else {
         res.render("show", {blog: foundBlog});
      }
   })
})

// NEW 
app.get("/blogs/new", function (req, res) {
   res.render("new");
})

// CREATE
app.post("/blogs", function (req, res) {
   //clean input from scripts and stuff
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function (err, blog) {
      if (err) {
         res.render("new");
      } else {
         res.redirect("/blogs");
      }
   })
});

//EDIT
app.get("/blogs/:id/edit", function(req, res) {
   Blog.findById(req.params.id, function(err, blog){
      if(err){
         res.redirect("/blogs");
      } else {
         res.render("edit", {blog: blog});
      }
   })
});

//UPDATE 
app.put("/blogs/:id", function(req, res) {
   //clean input from scripts and stuff
   req.body.blog.body = req.sanitize(req.body.blog.body);

   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
      if(err) {
         res.redirect("/blog");
      } else {
         res.redirect("/blogs/" + req.params.id);
      }
   })
});

//DELETE ROUTE 
app.delete("/blogs/:id", function(req, res) {
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err) {
         res.redirect("/blogs");
      } else {
         res.redirect("/blogs");
      }
   })
})












//===SERVER INIT====
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
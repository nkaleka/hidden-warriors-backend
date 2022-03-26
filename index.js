var express = require("express");
const session = require("express-session");
const fileupload = require("express-fileupload");

//Setup DB connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/hiddenWarriors" /*path of DB*/, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Setup model for the user
const User = mongoose.model("User", {
  Name: String,
  Email: String,
  UserName: String,
  Password: String,
  Location: String,
});

const Task = mongoose.model("Task", {
  Category: String,
  Location: String,
  DateTime: Date,
});

const Tasker = mongoose.model("Tasker", {
  Name: String,
  Category: String,
  Location: String,
  Price: Number,
  UserName: String,
  Password: String,
  image: String,
});

const Appointment = mongoose.model("Appointment", {
  User: String,
  Tasker: String,
  DateTime: String,
  // DateTime: Date,
  Price: Number,
  TaskName: String,
});

const Category = mongoose.model("Category", {
  Name: String,
});
var myApp = express();
myApp.use(express.urlencoded({ extended: true }));

myApp.use(fileupload());

myApp.use(
  session({
    secret: "superrandomsecret",
    resave: false,
    saveUninitialized: true,
  })
);

myApp.get("/categories", function (req, res) {
  Category.find().exec(function (err, categories) {
    res.send(categories);
  });
});

myApp.get("/taskers/:Category", function (req, res) {
  Tasker.find({ Category: req.params.Category }).exec(function (err, taskers) {
    res.send(taskers);
  });
});

myApp.get("/taskers", function (req, res) {
  Tasker.find().exec(function (err, taskers) {
    res.send(taskers);
  });
});

myApp.get("/tasks", function (req, res) {
  Task.find().exec(function (err, tasks) {
    res.send(tasks);
  });
});

myApp.get("/users", function (req, res) {
  User.find().exec(function (err, users) {
    res.send(users);
  });
});

myApp.post("/login", function (req, res) {
  var UserName = req.body.UserName;
  var Password = req.body.Password;
  User.findOne({ userName: UserName, Password: Password }).exec(function (
    err,
    admin
  ) {
    if (admin) {
      req.session.username = admin.username;
      req.session.userLoggedIn = true;
      res.send({ error: "login success" });
    } else {
      res.send({ error: "sorry login failed" });
    }
  });
});

myApp.post("/register", function (req, res) {
  console.log("I am here");
  var Name = req.body.Name;
  var Email = req.body.Email;
  var UserName = req.body.UserName;
  var Password = req.body.Password;
  var Tasker = Boolean(req.body.Tasker);
  var Address = req.body.Address;
  var Zipcode = req.body.Zipcode;

  var pageData = {
    Name: Name,
    Email: Email,
    UserName: UserName,
    Password: Password,
    Tasker: Tasker,
    Address: Address,
    Zipcode: Zipcode,
  };
  var newuser = new User(pageData);

  newuser.save().then(function () {
    console.log("New User Registered");
    User.find({}).exec(function (err, users) {
      res.send("success");
    });
  });
});

myApp.post("/add-appointment", function (req, res) {
  var data = {
    User: req.body.User,
    Tasker: req.body.Tasker,
    DateTime: req.body.DateTime,
    Price: req.body.Price,
    TaskName: req.body.TaskName,
  };
  var appt = new Appointment(data);

  appt.save().then(function () {
    Appointment.find({}).exec(function (err, users) {
      if (err) {
        res.send("Error saving appointment: " + err.message);
      } else {
        res.send("success");
      }
    });
  });
});

myApp.listen(8080);
console.log("server running");

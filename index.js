var express = require("express");
const session = require("express-session");
const fileupload = require("express-fileupload");
var path = require("path");

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
  City: String,
  Address: String,
  Country: String,
  Postcode: String,
  Phone: String,
});

const Task = mongoose.model("Task", {
  Category: String,
  Location: String,
  Name: String,
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
  AppointmentDate: String,
  FullName: String,
  Country: String,
  Address: String,
  City: String,
  Postcode: String,
  Phone: String,
  Email: String,
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

myApp.set("views", path.join(__dirname, "views"));
myApp.use(express.static(__dirname + "/public"));
myApp.set("view engine", "ejs");

function categoriesHandler(req, res) {
   Category.find().exec(function (err, categories) {
    res.render("index", { categories: categories });
  });
}
myApp.get('/', categoriesHandler);

function secondCategoriesHandler(req, res) {
   Category.find().exec(function (err, categories) {
    res.render("categories", { categories: categories });
  });
}
myApp.get('/categories', secondCategoriesHandler);

function tasksHandler(req, res) {
   Category.find().exec(function (err, categories) {
    res.render("tasks", { tasks: tasks, categories: categories  });
  });
}
myApp.get('/tasks', tasksHandler);

 function tasksCategoryHandler(req, res) {
 Task.find({ Category: req.params.category }).exec(function (err, tasks) {
    Category.find().exec(function (err, categories) {
      res.render("tasks", { tasks: tasks, categories: categories });
    });
  });
}
myApp.get('/tasks/:category', tasksCategoryHandler);

function taskerCategoriesHandler(req, res) {
    Tasker.find({ Category: req.params.category }).exec(function (err, taskers) {
    console.log(taskers);
    Category.find({ Name: req.params.category }).exec(function (
      err,
      categories
    ) {
      console.log(categories);
      res.render("taskers", {
        taskers: taskers,
        categories: categories,
        task: req.params.task,
      });
    });
  });
}
myApp.get('/taskers/:category/:task', taskerCategoriesHandler);

function taskerNameHandler(req, res) {
  Tasker.findOne({ Name: req.params.name }).exec(function (err, tasker) {
    Category.find().exec(function (err, categories) {
      res.render("tasker", {
        tasker: tasker,
        categories: categories,
        task: req.params.task,
      });
    });
  });
}
myApp.get('/tasker/:name/:task', taskerNameHandler);


function checkoutNameHandler(req, res) {
   if (req.session.userLoggedIn) {
    Tasker.findOne({ Name: req.params.name }).exec(function (err, tasker) {
      res.render("logincheckout", {
        tasker: tasker,
        task: req.params.task,
        Name: req.session.UserName,
      });
    });
  } else {
    Tasker.findOne({ Name: req.params.name }).exec(function (err, tasker) {
      res.render("checkout", { tasker: tasker, task: req.params.task });
    });
  }
}
myApp.get('/tasker/:name/:task', checkoutNameHandler);

function usersHandler(req, res) {
  User.find().exec(function (err, users) {
    res.send(users);
  });
}
myApp.get('/users', usersHandler);

myApp.get("/login", function (req, res) {
  res.render("login");
});

myApp.get("/register", function (req, res) {
  res.render("register");
});

myApp.post("/login", function (req, res) {
  var UserName = req.body.UserName;
  var Password = req.body.Password;
  User.findOne({ userName: UserName, Password: Password }).exec(function (
    err,
    admin
  ) {
    if (admin) {
      req.session.username = UserName;
      console.log(req.session.username);
      req.session.userLoggedIn = true;
      res.render("success", { message: "login success" });
    } else {
      res.render("success", { message: "sorry login failed" });
    }
  });
});

myApp.post("/register", function (req, res) {
  console.log("I am here");
  var Name = req.body.Name;
  var Email = req.body.Email;
  var UserName = req.body.UserName;
  var Password = req.body.Password;
  var City = req.body.City;
  var Address = req.body.Address;
  var Province = req.body.Province;
  var Postcode = req.body.Postcode;
  var Country = req.body.Country;
  var Phone = req.body.Phone;

  var pageData = {
    Name: Name,
    Email: Email,
    UserName: UserName,
    Password: Password,
    City: City,
    Province: Province,
    Address: Address,
    Postcode: Postcode,
    Country: Country,
    Phone: Phone,
  };
  var newuser = new User(pageData);

  newuser.save().then(function () {
    console.log("New User Registered");
    User.find({}).exec(function (err, users) {
      res.render("success", {
        message: "user successfully registered!",
      });
    });
  });
});

myApp.post("/add-appointment", function (req, res) {
  var data = {
    User: req.body.User,
    Tasker: req.body.Tasker,
    Price: req.body.Price,
    TaskName: req.body.TaskName,
    AppointmentDate: req.body.DateTime,
    FullName: req.body.User,
    Country: req.body.Country,
    Address: req.body.Address,
    City: req.body.City,
    Postcode: req.body.Postcode,
    Phone: req.body.Phone,
    Email: req.body.Email,
    AppointmentTime: req.body.AppointmentTime,
  };
  var appt = new Appointment(data);

  appt.save().then(function () {
    Appointment.find({}).exec(function (err, users) {
      if (err) {
        res.send("Error saving appointment: " + err.message);
      } else {
        res.render("success", {
          message: "You appointment has been created successfully!",
        });
      }
    });
  });
});

myApp.listen(8000);
console.log("server running");

module.exports = categoriesHandler, secondCategoriesHandler, tasksHandler, tasksCategoryHandler, taskerCategoriesHandler, taskerNameHandler, checkoutNameHandler, usersHandler;

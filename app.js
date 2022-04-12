//app.js

//jshint esversion:6

const cl = (...args) => console.log(...args);


// Dotenv to access .env files
require("dotenv").config();
const audienceId = process.env.N1_KEY;
const apiString = process.env.N1_SECRET;
const server = process.env.N1_SERVER;
const apiAuth = "myname" + apiString;


// Possibly need to add __dirnam for Edge Browser
const dirName = __dirname;


// Express & https
const express = require("express");

const https = require("https");

const app = express();


//Body Parser
const bodyParser = require("body-parser");


//USE
app.use(
  bodyParser.urlencoded({
  extended: true,
}),
  express.static(__dirname + "/public")
);


//Mailchimp for now
const client = require("@mailchimp/mailchimp_marketing");


//setConfig
client.setConfig({
  apiKey: process.env.N1_SECRET,
  server: "us14"
});


//Get
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});


//Post
app.post("/", function(req, res) {

  const listId = "c71eebaa4d"
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email
  }

  async function run() {
    try {
      const response = await client.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });

      console.log("Successfully added contact as an audience member. The contacts id is ${response.id}");

      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      res.sendFile(__dirname + "/failure.html");
    }

  }

  run();

});

//Redirect
app.post("/failure", function(req, res) {
  res.redirect("/");
});


//Localhost and heroku

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000")
});

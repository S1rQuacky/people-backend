///////////////////////////
//Dependencies - step 1
///////////////////////////
//dotenv to get env variables
require("dotenv").config()
//pull port variable 
const {PORT = 3000, MONGODB_URL} = process.env
//import express
const express = require("express")
//create app object
const app = express()
//import mongoose - step 4.1
const mongoose = require("mongoose") 
//import Middleware - step 5
const cors = require("cors"); //cors headers, security to allow access 
const morgan = require("morgan") //logging

///////////////////////////
//Dabase connection - step 4
///////////////////////////
//Establish connection 
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

//Connection Events - step 4.2
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

  //////////////////////////
  //Models - Step 6
  //////////////////////
  const peopleSchema = new mongoose.Schema({
      name: String,
      image: String,
      title: String
  })

  const People = mongoose.model("People", peopleSchema)

  ////////////////////
  //Middleware - Step 7
  //////////////////
  app.use(cors())//prevent cors errors
  app.use(morgan("dev")) //logging
  app.use(express.json())//parse json bodies


//////////////////////////////
// Routes and Routers - 
///////////////////////////////
//test route - step 2
app.get("/", (req, res) => {
    res.send("Hello World")
})

//index route - Step 8
//get us all the peoples 
app.get("/people", async (req, res) => {
    try {
        //send all the people
        res.json(await People.find({}))
    }catch (error) {
        //send error
        res.status(400).json((error))
    }
})

//Create Route - step 9 
//create a perso from JSON body
app.post("/people", async (req, res) => {
    try {
        //create new people
        res.json(await People.create(req.body))
    }catch(error){
        res.status(400).json({error})
    }
})

//update route - put request to /people/:id - Step 10
//update specific person 
app.put("/people/:id", async (req, res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, 
                {new: true})
        )
    } catch (error){
        res.status(400).json({error})
    }
})

//Destroy route - step 11
//delete request to /people/:id
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error){
        res.status(400).json({error})
    }
})
////////////////////////////////
//Server Listener - Step 3 (shoule now be able to connect to localhost)
////////////////////////////////
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
})
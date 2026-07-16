// console.log("Hello");
// Import Express
import express from "express";

// Create Express app
const app = express();

// Enable JSON middleware
app.use(express.json());

// GET endpoint
app.get("/",(req,res)=>{
    res.json({
    message: "Hello from my first API GET Enpoint!"
  });
});

// To store user data
let users={};
let id=1;

app.get("/users", (req, res) => {
  // Check if our users object has any keys stored in it
  const hasUsers = Object.keys(users).length > 0;

  if (hasUsers) {
    res.json({
      names: users
    });
  } else {
    res.json({
      message: "no users found"
    });
  }
});


// POST endpoint
app.post("/user",(req,res)=>{
    let nameInput=req.body.name;
    if(!nameInput){
        return res.status(400).json({
            message:"name is required"
        })
    }
    users[id]=nameInput;
    res.json({
        message:"your data has been received",
        id:id,
        data:req.body
    })
    id++;

});

// PUT endpoint
app.put("/user/:id",(req,res)=>{
    const userid=req.params.id;
    let nameInput=req.body.name;
    if(!nameInput){
        return res.status(400).json({
            message:"name is required"
        })
    }
    if(!users[userid]){
        return res.status(404).json({
            message:"user not found"
        })
    }
    users[userid]=nameInput;
    res.json({
        message:"your data has been updated",
        id:userid,
        data:req.body
    })

});

// DELETE endpoint
app.delete("/user/:id",(req,res)=>{
    const userid=req.params.id;
    if(!users[userid]){
        return res.status(404).json({
            message:"user not found"
        })
    }
    delete users[userid];
    res.json({
        message:"your data has been deleted",
        id:userid
    })
});

// Start server and listen on a port

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
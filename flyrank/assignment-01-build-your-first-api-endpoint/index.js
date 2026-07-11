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


// POST endpoint
app.post("/user",(req,res)=>{
    res.json({
        message:"your data has been received",
        data:req.body
    })

});

// Start server and listen on a port

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
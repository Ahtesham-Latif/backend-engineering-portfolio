import express from 'express';

const app = express();

app.use(express.json());


app.get('/health',(req,res)=>{
    res.status(200).json(
        {"status": "ok"})
});

const PORT=3000;

app.listen(PORT,()=>{
    console.log(`App running on http://localhost:${PORT}`)
});
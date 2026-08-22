import 'dotenv/config';
import express from 'express';
import {Inngest} from 'inngest';
import {serve} from 'inngest/express';

const app = express();
app.use(express.json());


app.get('/health',(req,res)=>{
    res.status(200).json(
        {"status": "ok"})
});
// Client
export const inngest = new Inngest({id:"report-api"});

//Function

const sayHello = inngest.createFunction(
  { id: "say-hello" , event: "test/hello" },
  async ({ step }) => {
    await step.sleep("wait-a-bit", "5s");
    return "Hello from the background!";
  }
);

app.use("/api/hello",serve({ client: inngest, functions: [sayHello] }));


const PORT=Number(process.env.PORT) || 3000;

app.listen(PORT,()=>{
    console.log(`App running on http://localhost:${PORT}`)
});
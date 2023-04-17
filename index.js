const express=require("express")
const app=express()
const router=require("./routes/reg")
app.use(express.json())
const connect=require("./database/db")
const cors=require("cors")
app.use(cors())

app.use("/",router)


app.listen(3000), async()=>{
try {
    await connect
    console.log("connected to the db");
} catch (error) {
    console.log(error);
}
}
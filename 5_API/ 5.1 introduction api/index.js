import express from "express";
import bodyParser from "body-parser";


const app=express();
const port=3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(res,req)=>{
    const info=satellites/[2554]/positions
    console.log(info.latitude);
    console.log(info.longitude);
})
app.listen(port,()=>{
    console.log("listening");
})
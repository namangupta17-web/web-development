import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"Naman",
  port:5432,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try{
    const response=await db.query("SELECT * FROM visited_countries");
    const result=response.rows;
    console.log(result);
    const total_country=result.length;
    let countryCodesArray = [];
    for (let i = 0; i < result.length; i++) {
      let row = result[i];
       countryCodesArray.push(row.country_code);
}
    res.render("index.ejs",{
      total:total_country,
      countries:countryCodesArray,
    });  
  }
  catch(err){
    console.error("Database error:", err.stack);
    res.status(500).send("Server error");
  };
});


app.post("/add",async(req,res)=>{
  const new_Data=req.body.country;
  const response=await db.query("SELECT * FROM countries");
  const result=response.rows;
  let country_code=[];
  const countryArray = result.map(row => row.country);
   const countryCodesArray = result.map(row => row.country_code);
  for(let i=0;i<result.length;i++){
    let country_table=countryArray[i];
    console.log(countryArray[i]);
    console.log(new_Data);
    if(new_Data.toLowerCase()==country_table.toLowerCase()){
      country_code.push(countryCodesArray[i]);
    }};
     console.log(country_code);
  const response_2=await db.query("INSERT INTO visited_countries(country_code)VALUES ($1)",
  [country_code[0]]
  );
  res.redirect("/");
  }
);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

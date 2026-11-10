import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Naman",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;
async function users(){
  let final=[];
  const result=await db.query("SELECT * FROM users ");
  final=result.rows;
  return final;
};

async function checkVisisted(currentUserId) {
  const result = await db.query("SELECT country_code FROM visited_countries where user_id=$1",[currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(countries);
  return countries;
}

async function colors(userid=1){
  const result=await db.query("SELECT color  FROM users where id=$1",[currentUserId]);
  const color = result.rows;
  const final_color=color.map(row=>row.color);
  return final_color;
};

app.get("/", async (req, res) => {
  const countries = await checkVisisted(currentUserId);
  const user= await users();
  const color=await colors(currentUserId);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: user,
    color:color,
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
  
    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      await db.query(
        "INSERT INTO visited_countries (user_id,country_code ) VALUES ($1,$2)",
        [currentUserId,countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisisted();
      const user= await users();
      const color=await colors();
       res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: user,
        color:color,
        error:"Country has been already added try again"
  });
      
    }
  } catch (err) {
     console.log(err);
    const countries = await checkVisisted();
      const user= await users();
      const color=await colors();
       res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        users: user,
        color:color,
        error:"YOU HAVE ENTERED WRONG NAME TRY AGAIN LATER"});
   
  }
});

app.post("/user", async (req, res) => {
  const result=req.body;
  currentUserId= result.user;
  if(result.user==undefined){
    res.render("new.ejs");
  }else{
  res.redirect("/");
}});
app.post("/new", async (req, res) => {
  const data=req.body;
  console.log(data);
  const result= await db.query("INSERT INTO USERS(name,color)VALUES($1,$2)",[data.name,data.color]);
  res.redirect("/");
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

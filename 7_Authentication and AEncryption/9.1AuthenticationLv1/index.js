import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db= new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"secrets",
  password:"Naman",
  port:5432,
});
db.connect()
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
  const result=await db.query("INSERT INTO public.users(email,password) VALUES($1,$2)",[email,password]);
  res.redirect("/");
});

app.post("/login", async (req, res) => {
    const email=req.body.username;
    const password=req.body.password;
  const result=await db.query("SELECT * FROM users");
  const value=result.rows;
  const emails= value.map(row=>row.email);
  const passwords= value.map(row=>row.password);
  console.log(passwords);
  console.log(password);
  for(let i=0;i<emails.length;i++){
    if(email==emails[i] && password==passwords[i]){
      res.render("secrets.ejs");
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

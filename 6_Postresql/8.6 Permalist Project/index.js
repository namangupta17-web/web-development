import express from "express";
import bodyParser from "body-parser";
import pg from"pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"Naman",
  port:5432,
});
db.connect();
async function list(){
  const result=await db.query("SELECT * FROM items");
  let data=result.rows;
  return data;

};

app.get("/", async(req, res) => {
  const items= await list();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const items=await list();
  console.log(items);
  const item = req.body.newItem;
  console.log(item);
  items.push({ title: item });
  const result=await db.query("INSERT INTO items(title) VALUES($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const items= req.body;
  console.log(items);
  const result= await db.query("UPDATE items set title=$1 where id=$2",[items.updatedItemTitle ,items.updatedItemId]);
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const items=req.body;
  console.log(items);
  const result= await db.query("DELETE FROM items WHERE id=$1",[items.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

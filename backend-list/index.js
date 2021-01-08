const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db.js");
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json("Server Running");
});

app.post("/getData", async (req, res) => {
    const {user_id} = req.body;
    let retdata = await pool.query("SELECT * FROM todoitems WHERE user_id = $1", [user_id]);
    res.json(retdata.rows);
});

app.post("/addData", async (req, res) => {
    const {name, info, user_id} = req.body;
    const task_id = uuidv4();
    let retData = await pool.query("INSERT INTO todoitems (name, info, user_id, task_id) VALUES ($1, $2, $3, $4) RETURNING *", [name, info, user_id, task_id]);
    let newData = retData.rows[0];
    res.json(newData);
});

app.post("/delData", async (req, res) => {
    const {name, info, user_id, task_id} = req.body;
    let retData = await pool.query("DELETE FROM todoitems WHERE task_id = $1", [task_id]);
    res.json({success: retData.rowCount === 1});
});

app.post("/editData", async (req,res) => {
    const {name, info, user_id, task_id} = req.body;
    let retData = await pool.query("UPDATE todoitems SET name = $1, info = $2 WHERE task_id = $3;", [name, info, task_id]);
    res.json({success: retData.rowCount === 1});
});

app.post("/validate", async (req, res) => {
    const {username} = req.body;
    let retdata = await pool.query("SELECT * FROM userinfo WHERE user_name = $1;", [username]);
    res.json(retdata.rowCount);
});

app.post("/signup", async (req, res) => {
    const {username, password} = req.body;
    const task_id = uuidv4();
    let retdata = await pool.query("INSERT INTO userinfo (user_name, user_pass, user_id) VALUES ($1, $2, $3) RETURNING *", [username, password, task_id]);
    res.json(retdata.rows[0]);
});

app.post("/verify", async (req, res) => {
    const {username, password} = req.body;
    let retdata = await pool.query("SELECT * FROM userinfo WHERE user_name = $1 AND user_pass = $2;", [username, password]);
    let result = {success: retdata.rowCount, info: retdata.rows}
    res.json(result);
});

app.listen(5000, () => {
    console.log("Port Started");
});



import express from "express"
import mysql from "mysql"

const PORT = 8080;
const app = express()

const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"LUTO"
})

app.get("/", (req, res) => {
    res.json("good mourning.")
})
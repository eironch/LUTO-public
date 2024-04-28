import express from "express"
import mysql from "mysql"

const app = express()

const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"LUTO"
})

app.listen(8800, () => {
    console.log("Connected to Server!")
})
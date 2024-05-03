import express from "express"
import mysql from "mysql"

const PORT = 8080
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

app.get("/create-account", (req, res) => {
    const queryParams = req.query
    const username = queryParams.username
    const password = queryParams.password

    let query = `SELECT * FROM USERS WHERE ?`

    db.query(query, username, (err, data) => {
        if (err) {
            return res.json(err)
        } else if (data.length > 0) {
            return res.json({ success: false, message: "Username exists."})
        }

        createAccount(username, password)
    })
})

function createAccount(username, password) {
    query = `INSERT INTO USERS(username, password) VALUES (?, ?)`

    db.query(query, [username, password], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json({ success: false, message: "User account created." })
    })
}

app.get("/sign-in", (req, res) => {
    const queryParams = req.query
    const username = queryParams.username
    const password = queryParams.password

    let query = `SELECT * FROM USERS WHERE username = ? AND pasword = ?`
    
    db.query(query, [username, password], (err, data) => {
        if (err) {
            return res.json(err)
        } else if (data.length > 0) {
            return res.json({ success: true, message: "User signed in." })
        }
        return res.json({ success: false, message: "Incorrect username or password." })
    })
})

app.listen(PORT, () => {
    const username = "userx"
    const password = "password123"

    let query = `SELECT * FROM USERS WHERE`
    
    db.query(query, [username, password], (err, data) => {
        console.log(data)
        if (err) {
            console.log(err)
            return
        } else if (data.length > 0) {
            console.log(({ success: true, message: "User signed in.", data}))
            return
        }
        console.log({ success: false, message: "Incorrect username or password." })
    })
})
var express = require('express');
var app = express();
var mysql = require('mysql');
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser')
const fs = require('fs');
const dotenv = require('dotenv').config()
app.use(bodyParser.urlencoded({
    extended: false
}))
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
app.use(allowCrossDomain)
// parse application/json
app.use(bodyParser.json())


app.post("/CreateDB", function (req, res) {
    DB = JSON.parse(req.body.data)
    console.log(DB)

    var text = `DB_HOST=${DB.host} \n DB_USER=${DB.user} \n DB_PASSWORD=${DB.password} \n DB_DATABASE=${DB.database}`

    fs.writeFile("./.env", text, function (err) {
        if (err) {
            return console.log(err);
        }

        var con = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        })


        con.connect(function (err) {
            if (err) {
                databaseOK = false
                console.log("no database", err)

            } else {

                databaseOK = true
                console.log(" Databse Connected!");
            }
        });

        console.log("The file was saved!");
    })
})


// console.log("process.env.DB_PASSWORD:", process.env.DB_PASSWORD)
console.log(process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD);

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

con.connect(function (err) {
    if (err) {
        databaseOK = false
        console.log("no database", err)

    } else {

        databaseOK = true
        console.log(" Databse Connected!");
    }
});

con.query(`CREATE DATABASE IF NOT EXISTS CRUD123; `, function (err, result, fields) {
    con.query('CREATE TABLE `CRUD123`.`Users` (`UID` INT(15) NOT NULL,`firstName` VARCHAR(45) NULL,`lastName` VARCHAR(45) NULL,`city` VARCHAR(45) NULL,`postalCode` INT(11) NULL,`phoneNumber` INT(11) NULL,`position` VARCHAR(45) NULL,PRIMARY KEY (`UID`));', function (err, result, fields) {
        console.log("->>>>>>>>>>>>>>>sss>>>>ss>>", err )
    })
    console.log("->>>>>>>>>>>>>>>>>>>>>", err)
})

con.query(`USE CRUD123; `, function (err, result, fields) {
    console.log("->>>>>>>>>>>>>>>>>>>ss>>", err)
})


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/2.html")
})
app.get("/home", function (req, res) {
    res.sendFile(__dirname + "/1.html")
})
app.post('/read', function (req, res) {
    console.log("sucsess")
    con.connect(function (err, result) {
        con.query("SELECT * FROM Users", function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    })
})  
app.post('/insert', function (req, res) {
    console.log("sucsesssdf")

    con.connect(function (err, result) {
        var user = JSON.parse(req.body.data);
        console.log(user)
        for (var key in user) {
            console.log(key)
        }

        var sql = `INSERT INTO Users (lastName, firstName ,city,postalCode,phoneNumber,position,UID) VALUES ( "${user.lastName}" , "${user.firstName}" ,  "${user.city}"  ,  "${ Number(user.postalCode) }" ,  "${Number(user.phoneNumber)}" ,  "${user.position}"   ,  "${user.UID}" );`;
        // console.log(sql)
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("data inserted");
        });
    })
})

app.post("/remove", function (req, res) {
    console.log(req.body)
    var UIDs = JSON.parse(req.body.data);
    console.log(UIDs)
    for (var i = 0; i < UIDs.length; i++) {
        con.query(`DELETE FROM Users Where UID=${UIDs[i]}`);
    }
    res.send(200)
})
app.post("/Edit", function (req, res) {
    con.connect(function (err) {
        console.log(req.body.id)
        id = Number(req.body.id);
        console.log(id)
        con.query("SELECT * FROM Users", function (err, result, fields) {
            var Uid;
            for (var i = 0; i < result.length; i++) {
                console.log(result[i].ID, id, i)

                if (i == id) {
                    console.log(result[i].ID)
                    Uid = result[i].ID;
                }
            }
            console.log(Uid)
            var sql = `UPDATE Users SET lastName="${req.body.lastName}" , firstName="${req.body.firstName}" ,age ="${req.body.age}"  WHERE ID= ${Uid}`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of records deleted: " + result.affectedRows);
            });
        });
    });
})

app.post("/Update", function (req, res) {
    con.connect(function (err) {
        var user = JSON.parse(req.body.data);
        console.log(user.UID)
        var sql = `UPDATE Users SET  lastName ="${user.lastName}" , firstName= "${user.firstName}" ,  city="${user.city}"  ,  postalCode="${ Number(user.postalCode) }" ,  phoneNumber="${Number(user.phoneNumber)}" ,  position="${user.position}"   WHERE UID= ${Number(user.UID)}`;
        console.log(sql)
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(200);
        });
    });
})

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
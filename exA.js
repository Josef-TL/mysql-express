const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");



const app = express();
const port = 3000;

app.use(cors());

//Host, user, password database
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"c@_@*u-YGTKcxrc4Fp!6",
    database:"pokemon"
});

app.get('/',(req,res)=>{
    res.send("HI :)")
})


// Ex A)
app.get('/all',(req, res)=>{
    connection.query('SELECT * FROM pokemon',(error,results)=>{
        res.send(results);
    });
});

// Ex B)
app.get('/all/names',(req, res)=>{
    connection.query('SELECT `name` FROM pokemon',(error,results)=>{
        res.send(results);
    });
});

// Ex C)
app.get('/primary-type/:primary',(req, res)=>{
    const primaryType = req.params.primary;

    connection.query('SELECT `name` FROM pokemon WHERE primary_type = ?',
        [primaryType],
        (error,results)=>{
        if(results.length < 1) {
            res.status(404).send("404 not found!");
        } else {res.send(results);
        }
        }
    );
});

// Ex D)
app.get('/speed/:speed',(req,res)=>{
    const speedHigherThan = req.params.speed;

    connection.query('SELECT * FROM pokemon WHERE speed > ?',[speedHigherThan],(error,results)=>{
        res.send(results);
    });
});

// Ex E)
app.get('/highest/:stat',(req,res)=>{
    const stat = req.params.stat;
    const allowedStats = ["attack", "defense", "hp", "specialAttack", "specialDefense", "speed"]

    if(!allowedStats.includes(stat)){res.send("Enter valid stat name")}

    connection.query('SELECT '+stat+',`name` FROM pokemon ORDER BY ' + stat + ' DESC LIMIT 1',(error,results)=>{
        res.send(results);
    });
});

// Ex F)
app.get('/average-speed/:primary',(req,res)=>{
    const primaryType = req.params.primary;

    connection.query('select avg(speed) as average,primary_type from pokemon where primary_type=? group by primary_type',
    [primaryType],
    (error,results)=>{
        res.send(results)
    });
});

// Ex G)
app.get('/total/:name',(req,res)=>{
    const pokemonName = req.params.name;


    connection.query('SELECT sum(attack+defence+hp+special_attack+special_defence+speed) as total_stats, `name` FROM pokemon where `name`= ? group by `name`',
        [pokemonName],(error,results)=>{
            res.send(results)
        });
});

// Ex H)
app.get('/higher-than-average/:name/:stat',(req,res)=>{
    const pokemonName = req.params.name;
    const pokemonStat = req.params.stat;

    let average= 0;
    let stat = 0;

    connection.promise().query('SELECT avg(attack), avg(defence), avg(special_attack) ,avg(special_defence) ,avg(speed) ,avg(hp) FROM pokemon')
        .then(([rows,fields])=>{
            console.log(rows);
            }).then(res.send(`${average}`)

    );

/*
    connection.query('SELECT * FROM pokemon WHERE `name` = ?',[pokemonName],(error,results)=>{
        stat = results[0][pokemonStat];
    })

 */
});


app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});

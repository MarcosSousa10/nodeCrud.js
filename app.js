const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { engine } = require('express-handlebars');
const urlencodeParser = bodyParser.urlencoded({ extended: false });
const app = express();
const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_current_password',
    port: '3306'
});
sql.query("use nodejs");
app.use('/img', express.static('img'));
//template engine
app.engine("handlebars", engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));


app.get("/", function (req, res) {
    //  res.send("teste")
    //res.sendFile(__dirname+"/index.html")
    res.render('index');
});
app.get('/deletar/:id', function (req, res) {
    sql.query("delete from user where id=?", [req.params.id]);
    res.render('deletar');
});
//app.get("/javascript", function (req, res) { res.sendFile(__dirname + '/js/javascript.js'); });
//app.get("/style", function (req, res) { res.sendFile(__dirname + '/css/style.css'); });
app.get("/inserir", function (req, res) { res.render("inserir"); });
app.get("/select/:id?", function (req, res) {
    if (!req.params.id) {
        sql.query("select * from user order by id asc", function (err, results, fields) {
            res.render('select', { data: results });
        });
    } else {
        sql.query("select * from user where id=?", [req.params.id], function (err, results, fields) {
            res.render('select', { data: results });
        });

    }
});
app.get("/update/:id", function (req, res) {
    sql.query("select * from user where id=?", [req.params.id], function (err, results, fields) {
        res.render('update', { id: req.params.id, name: results[0].nome, age: results[0].age })
    })
});
app.post("/controllerUpdate", urlencodeParser, function (req, res) {
    //   console.log(req.body.name);
    sql.query("update user set nome=?,age=? where id=?", [req.body.name, req.body.age, req.body.id]);
    res.render("controllerUpdate");
});

app.post("/controllerForm", urlencodeParser, function (req, res) {
    sql.query("insert into user values (?,?,?)", [req.body.id, req.body.name, req.body.age])
    res.render('controllerForm', { name: req.body.name });
});





app.listen(8081, function (req, res) {
    console.log('Servidor rodando')
})
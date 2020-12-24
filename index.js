const express = require('express')
const path = require('path');
const converter = require('json-2-csv');

const app = express()

const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.status('200').send("hello")
})

app.get('/generateTimeTable', async (req, res) => {
    let timeTable = await require('./script').generateClassTimeTable()
    res.render('timeTable',{timeTable})
})

app.listen(PORT, () => {
    console.log("The Server Started on PORT 3000")
})

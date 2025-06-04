const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mariadb = require('mariadb');


const app = express();
const port = 3000;


// Set EJS as the view engine
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index'); // Render the 'index.ejs' file
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


app.use(express.static('public'));


// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));


// Define a route to handle form submissions
app.post('/submit', (req, res) => {
  // Access data from the form via req.body
  const name = req.body.name;
  const email = req.body.email;
  const userID = req.body.id;
  const userPassword = req.body.password;


  // Connect to MariaDB
  const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'testerUser',
    password: 'password',
    database: 'exampleDB'
  });


  pool.getConnection()
    .then(conn => {
      // Prepare the SQL statement with placeholders for data
      const sql = 'INSERT INTO characters (first_name, last_name, email, user_id, password) VALUES (?, ?, ?,?,?)';


      let names = name.split(" ");
      let first = names[0];
      let last = names[1];
     
      // Execute the query with actual data
      return conn.query(sql, [first, last, email, userID, userPassword]);
    })
    .then(() => {
      console.log('Data inserted successfully');
      // Send a success response to the frontend
      res.send('Data submitted successfully!');
    })
    .catch(err => {
      console.error('Error inserting data:', err);
      // Send an error response to the frontend
      res.status(500).send('Error submitting data!');
    })
    .finally(() => {
      pool.end(); // Close the database connection
    });




});

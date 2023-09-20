const express = require('express')
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_test',
  port: 3306
});

app.use(express.json());


// -- Routes -- //

// GET ALL
app.get("/read", async(req,res) => {
  try {
    connection.query("SELECT * FROM customers", (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      return res.status(200).json(results);
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

// GET SOME
app.get("/read/:id", async(req,res) => {
  
  const id = req.params.id;

  try {
    connection.query(
      "SELECT * FROM customers WHERE customer_id = ?",
      [id],
      (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      return res.status(200).json(results);
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

// UPDATE
app.put("/update/:id", async(req,res) => {
  
  const id = req.params.id;
  const {fname, lname, email} = req.body;

  try {
    connection.query(
      "UPDATE customers SET fname = ?, lname = ?, email = ? WHERE customer_id = ?",
      [fname, lname, email, id],
      (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      return res.status(200).json({message: "Successfully updated!"});
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

// CREATE 
app.post("/create", async(req,res) => {
  const {fname, lname, email} = req.body;

  try {
    connection.query(
      "INSERT INTO customers(fname, lname, email) VALUES(?, ?, ?)",
      [fname, lname, email],
      (err, results, field) => {
        if(err) {
          console.error("ERROR while inserting a user into the database", err);
          return res.status(400).send(err);
        }
        return res.status(201).json({message: "New user successfully created!"});
      }
    )

  } catch (err) {
      console.error(err.message);
      res.status(500).send();
  }
})

// DELETE
app.delete("/delete/:id", async(req,res) => {
  
  const id = req.params.id;

  try {
    connection.query(
      "DELETE FROM customers WHERE customer_id = ?",
      [id],
      (err, results, field) => {
      if(err) {
        console.error(err);
        return res.status(404).send();
      }
      if(results.affectedRows === 0) {
        return res.status(404).json({message: "No customer exit in database."});
      }
      return res.status(200).json({message: "Successfully deleted!"});
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
})

app.listen(port, () => {
  `Server is running on port ${port}`
})
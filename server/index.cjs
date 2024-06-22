const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql2/promise')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ouan',
    port: 3306
  })
}

const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("Add your name");
  }
  if (!userData.lastname) {
    errors.push("Add your lastname");
  }
  if (!userData.age) {
    errors.push("Add your age");
  }
  if (!userData.gender) {
    errors.push("Select your gender");
  }
  if (!userData.interests) {
    errors.push("Select your interests");
  }
  if (!userData.description) {
    errors.push("Add your description");
  }
  return errors;
}

app.get('/testdb-new', async (req,res) => {
  try{
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
  }catch{
    console.error('Error fetching users:', error.message)
    res.status(500).json({ error: 'Error fetching users' })
  }
})

const port = 8000

app.get('/users', async (req,res) => {
  // const filterUsers = users.map(user => {
  //   return {
  //     id: user.id,
  //     firstname: user.firstname,
  //     lastname: user.lastname,
  //     fullname: user.firstname + ' ' +  user.lastname
  //   }
  // })
  // res.json(filterUsers)
  const results = await conn.query('SELECT * FROM users')
  res.json(results[0])  
})

app.get('/users/:id', async (req,res) => {
  try {
    let id = req.params.id
    const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
    
    if(results[0].length == 0 ){
      throw {statusCode: 404, message: 'User not found'}
    }
    res.json(results[0][0])
  } catch (error) {
    console.error("Error fetching users:", error.message);
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      error: 'Error fetching users',
      errorMessage: error.message
    })
  }
})

app.post('/users', async (req,res) => {
  try{
    let user = req.body

    const errors = validateData(user)
    if(errors.length > 0){
      throw{
        message: 'Data incomplete from frontend',
        errors: errors
      }
    }

    const results = await conn.query("INSERT INTO users SET ?", user);
    res.json({
      message: 'insert ok',
      data: results[0]
    })
  } catch (error) {
    const errorMessage = error.message || 'Error creating user'
    const errors = error.errors || []
    console.error('Error creating user:', error.message)
    res.status(500).json({
      message: errorMessage, 
      errors: errors
    })
  }
})

app.put('/users/:id', async (req,res) => {
  let id = req.params.id
  let updateUser = req.body

  try{
    const results = await conn.query(
      "UPDATE users SET ? WHERE id = ?", 
      [updateUser,id]
    )
    res.json({
      message: 'Update   ok',
      data: results[0]
    })
  } catch (error) {
    console.error('Error creating user:', error.message)
    res.status(500).json({ error: 'Error creating user' })
  }
})

app.patch('/users/:id', (req,res) => {
  let id = req.params.id
  let updateUser = req.body

  let selectedIndex = users.findIndex(user => user.id == id)

  if(updateUser.firstname){
    users[selectedIndex].firstname = updateUser.firstname
  }
  if(updateUser.lastname){
    users[selectedIndex].lastname = updateUser.lastname
  }
  
  // res.send(selectedIndex + '')
  res.json({
    message : 'update users complete',
    data : {
      user : updateUser,
      indexUpdate : selectedIndex
    }
  })
})

app.delete('/users/:id', async (req,res) => {
  let id = req.params.id
  try{
    const results = await conn.query("DELETE from users WHERE id = ?", id)
    res.json({
      message: 'DELETE   ok',
      data: results[0]
    })
  } catch (error) {
    console.error('Error creating user:', error.message)
    res.status(500).json({ error: 'Error creating user' })
  }
})

app.listen(port, async (req,res) => {
  await initMySQL()
  console.log('http server run at ' + port)
}) 
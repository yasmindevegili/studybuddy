const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");



app.use(cors());
app.use(express.json());

app.get("/todoapp_u6ex/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const todos = await pool.query(
      "SELECT * FROM todos WHERE user_email = $1",
      [userEmail]
    );
    res.json(todos.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar os to-dos.");
  }
});


//create a new todo
app.post("/todoapp_u6ex", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  const id = uuidv4();

  try {
    const newToDo = await pool.query(
      `INSERT INTO todos (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)`,
      [id, user_email, title, progress, date]
    );
    res.json(newToDo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar um to-do.");
  }
});


//edit a new todo
app.put("/todoapp_u6ex/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;

  try {
    const editToDo = await pool.query(
      `UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;`,
      [user_email, title, progress, date, id]
    );
    res.json(editToDo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao editar um to-do.");
  }
});

//delete a todo
app.delete("/todoapp_u6ex/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteToDo = await pool.query(
      `DELETE FROM todos WHERE id = $1;`,
      [id]
    );
    res.json(deleteToDo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar um todo.");
  }
});


//signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    await pool.query(
      `INSERT INTO users (email, hashed_password) VALUES ($1, $2)`,
      [email, hashedPassword]
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
    res.json({ email, token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao cadastrar usuário.");
  }
});




//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (!users.rows.length) {
      return res.status(401).json({ detail: "Usuário não existe!" });
    }

    const user = users.rows[0];
    const success = await bcrypt.compare(password, user.hashed_password);

    if (success) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
      res.json({ email: user.email, token });
    } else {
      res.status(401).json({ detail: "Login falhou!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao realizar login.");
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
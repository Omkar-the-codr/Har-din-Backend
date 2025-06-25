const pool = require("../config/db.js");

const postUser = async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const [result] = await pool.query(
      "Insert INTO users (name, email, age) values (?,?,?)",
      [name, email, age]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      age,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("Select * from users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query("Select * from users where id = ?", [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const putUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const [result] = await pool.query(
      "Update users SET name = ?, email = ?, age = ? where id = ?",
      [name, email, age, id]
    );
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("Delete from users where id = ?", [id]);
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Your user has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  postUser,
  getAllUsers,
  getUser,
  putUser,
  deleteUser,
};

const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const handleLogin = (req, res) => {
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
};

const handleAttemptLogin = async (req, res) => {
  const possibleLogin = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [req.body.username]
  );
  if (possibleLogin.rowCount !== 0) {
    const isSamePassword = await bcrypt.compare(
      req.body.password,
      possibleLogin.rows[0].password_hashed
    );
    if (isSamePassword) {
      req.session.user = {
        username: req.body.username,
        id: possibleLogin.rows[0].id,
        userid: possibleLogin.rows[0].userid,
      };
      res.json({ loggedIn: true, username: req.body.username });
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password" });
    }
  } else {
    res.json({ loggedIn: false, status: "Wrong username or password" });
  }
};

const handleRegister = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username FROM users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, password_hashed, userid) VALUES ($1, $2, $3) RETURNING id, username, userid",
      [req.body.username, hashedPassword, uuidv4()]
    );
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
      userid: newUserQuery.rows[0].userid,
    };
    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username is already taken" });
  }
};

module.exports = {
  handleLogin,
  handleAttemptLogin,
  handleRegister,
};

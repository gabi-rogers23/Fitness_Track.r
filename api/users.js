/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  createUser,
  getUser,
  getUserById,
} = require("../db");
const jwt = require("jsonwebtoken");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user != null) {
      res.status(400).send({
        error: "Duplicate User",
        name: "User Already Exists",
        message: `User ${username} is already taken.`,
      });
    } else if (password.length < 8) {
      res.status(400).send({
        error: "Password is Short",
        message: `Password Too Short!`,
        name: "Password is Short",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });

      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      // console.log("USER BEING RETURNED FROM DB IN API: ", await user);

      res.send({
        message: "thank you for signing up",
        token: token,
        user: user,
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser(req.body);

    if (!user) {
      next({
        name: "UserNotFound",
        message: "Username or Password is incorrect!",
      });
    } else {
      const token = jwt.sign(user, process.env.JWT_SECRET);

      res.send({
        message: "you're logged in!",
        token: token,
        user: user,
      });
    }
  } catch (error) {
    next(error);
  }
});


// GET /api/users/me
router.get("/me", async (req, res, next) => {
  try {
    const prefix = "Bearer ";
    const auth = req.headers.authorization;
    console.log(auth)
    if (auth && auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      // console.log("TOKEN ", token);
      const user = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("USER ", user);
      userObject = await getUserById(user.id);

      if (!userObject) {
        res.status(401).send({
          error: "Invalid User",
          message: `You must be logged in to perform this action`,
          name: "Invlaid User Token",
        });
      }

      res.send(userObject);
    } else {
      console.log("INSIDE ELSE")
      res.status(401).send({
        error: "No Token",
        message: `You must be logged in to perform this action`,
        name: "No User Token",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines

module.exports = router;

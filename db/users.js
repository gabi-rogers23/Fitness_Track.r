const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
     INSERT INTO users(username, password)
     VALUES($1, $2)
     RETURNING *;
    `,
      [username, password]
    );

    user.password = null;
    // console.log("CREATE USER FUNCTION RETURNING: ", user)
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
 const user = await getUserByUsername(username);

if (password === user.password){
  user.password = null;
  return user
}

  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT * FROM users
    WHERE id=${userId};
`);

    user.password = null;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT * FROM users
        WHERE username='${userName}';
    `);

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};

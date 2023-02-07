// database functions
const client = require("./client");
const bcrypt = require('bcrypt')
const SALT_COUNT = 10;


// user functions
async function createUser({ username, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    let userToAdd = {username, hashedPassword }

    const {
      rows: [user],
    } = await client.query(
      `
     INSERT INTO users(username, password)
     VALUES($1, $2)
     RETURNING *;
    `,
      [userToAdd.username, userToAdd.hashedPassword]
    );
    
    user.password = null;
    // console.log("CREATE USER FUNCTION RETURNING: ", user)
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  console.log("USERNAME", username, "PASSWORD", password)
  try {
 const user = await getUserByUsername(username);

 const hashedPassword = user.password;

 let passwordsMatch = await bcrypt.compare(password, hashedPassword) 

if (passwordsMatch){
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

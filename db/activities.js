const client = require("./client");
const { getAllRoutines } = require("./")

// database functions
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
     INSERT INTO activities(name, description)
     VALUES($1, $2)
     RETURNING *;
    `,
      [name, description]
    );

    
    // console.log("CREATE ACTIVITY FUNCTION RETURNING: ", activity);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: activities } = await client.query(`
    SELECT * 
    FROM activities;
    `);

    // console.log("GET ALL ACTIVITES FUNCTION RETURNING: ", activities);

    return activities;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
    SELECT * FROM activities WHERE id=${id};
    `);

    // console.log("GET ACTIVITY BY ID RETURNING: ", activity);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
    SELECT * FROM activities WHERE name='${name}';
    `);
//for strings use single quotes
    // console.log("GET ACTIVITY BY NAME RETURNING: ", activity);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function attachActivitiesToRoutines() {
  // select and return an array of all activities

 return getAllRoutines();

}


async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
try{
  const updateFields = {};
if (Object.hasOwn(fields, "name")){
  updateFields.name = fields.name;
}
if (Object.hasOwn(fields, "description")){
  updateFields.description = fields.description;
}

const setString = Object.keys(updateFields).map((key, i)=> `"${key}"=$${ i + 1 }`).join(', ')

const { rows : [updateActivity] } = await client.query(`
UPDATE activities
SET ${setString}
WHERE id=${id}
RETURNING *;
`, Object.values(updateFields))

return updateActivity;

}catch(error){
  throw error;
}


  
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};

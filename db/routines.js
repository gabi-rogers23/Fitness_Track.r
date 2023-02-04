const { getAllActivities } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    RETURNING *;`,
      [creatorId, isPublic, name, goal]
    );

    // console.log("CREATE ROUTINE FUNCTION RETURNING: ", routine);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
    SELECT * FROM routines WHERE id=${id};
    `);

    // console.log("GET ROUTINE BY ID RETURNING: ", routine);
    
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
    SELECT * 
    FROM routines;`);

    // console.log("GET ROUTINES WITHOUT ACTIVITES FUNCTION RETURNING: ", routines);

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {

    const { rows: routines } = await client.query(`
    SELECT r.*, u.username as "creatorName" 
    FROM routines r
    JOIN users u ON u.id = r."creatorId";
`);

// console.log("FIRST ROUTINES", routines)

const { rows: routineActivities } = await client.query(`
SELECT a.id AS id, a.name AS name, r.id AS "routineId", description, duration, count, goal, "isPublic", u.username AS creator, ra.id as "routineActivityId" 
FROM routines r
JOIN routine_activities ra
ON ra."routineId" = r.id
JOIN activities a 
ON a.id = ra."activityId"
JOIN users u
ON u.id = r."creatorId"; 
  `);
    // console.log("ROUTINE ACTIVITIES", routineActivities)

    routines.forEach((routine) => {
      routine.activities = routineActivities.filter((routineActivity) => { return routine.id === routineActivity.routineId })
    })
    // console.log("ALL ROUTINES", routines)
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try{
    const routines = await getAllRoutines();
    const publicRoutines = routines.filter((routine) => { return routine.isPublic})
    return publicRoutines;

  } catch(error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try{
    const routines = await getAllRoutines();
    const routinesByUser = routines.filter((routine) => { return routine.creatorName === username})
    return routinesByUser;
  } catch(error){
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try{
    const publicRoutines = await getAllPublicRoutines();
    const publicRoutinesByUser = publicRoutines.filter((routine) => { return routine.creatorName === username})
    return publicRoutinesByUser;
  } catch(error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try{
    const publicRoutines = await getAllPublicRoutines();
    const matchToRoutines = [];
    publicRoutines.forEach((routine) => {
      const activityId = routine.activities.map((activity) => {
        return activity.id;
      })
    if (activityId.includes(id)){
      matchToRoutines.push(routine)
    }
    })
    return matchToRoutines;
  } catch(error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  try{
    const updateFields = {};
    if (Object.hasOwn(fields, "isPublic")){
      updateFields.isPublic = fields.isPublic
    }
    if (Object.hasOwn(fields, "name")){
      updateFields.name = fields.name
    }
    if (Object.hasOwn(fields, "goal")){
      updateFields.goal = fields.goal
    }
    const setString = Object.keys(updateFields).map(
      (key, i) => `"${ key }"=$${ i + 1 }`
    ).join(', ');
    // console.log(setString);
    const {rows: [updatedRoutine]} = await client.query(`
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(updateFields));
    return updatedRoutine;
  }catch(error){
    throw error;
  }
}

async function destroyRoutine(id) {
  try{

    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = ${id};`)


    await client.query(`
      DELETE FROM routines
      WHERE id = ${id};
    `)

  }catch (error){
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};

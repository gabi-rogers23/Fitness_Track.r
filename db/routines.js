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
    console.log(publicRoutines);
  } catch(error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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

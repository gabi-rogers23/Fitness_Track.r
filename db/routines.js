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

    console.log("GET ROUTINE BY ID RETURNING: ", routine);
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
    const routines = await getRoutinesWithoutActivities();

    const routineIds = routines.map((routine) => {
      return routine.id;
    });

    const { rows: routinesActivities } = await client.query(`
  SELECT * FROM routine_activities WHERE "routineId" in(${routineIds});
  `);

    const activityIds = routinesActivities.map((routineActivity) => {
      return routineActivity.activityId;
    });

    const { rows: activities } = await client.query(`
SELECT * FROM activities WHERE id in(${activityIds});
`);

routines.map((routine)=>{
 const routineActivitesById = routinesActivities.filter((el)=>{
  return routine.id === el.routineId
 })

 const activityId = routineActivitesById.map((el)=>{
    return el.activityId
 })

const activitiesById = activities.filter((el)=>{
  return activityId.includes(el.id)
})

routine.activities = activitiesById;
})


    console.log("GET ALL ROUTINES RETURNING: ", routines)

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

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

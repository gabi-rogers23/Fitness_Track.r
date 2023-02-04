const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );

    // console.log("ADD ACTIVITY TO ROUTINE RETURNING: ", routine);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(`
    SELECT * FROM routine_activities
    WHERE id=${id}
    `);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT * FROM routine_activities
    WHERE "routineId"=${id}
    `);

    return routines;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const updateFields = {};
    if (Object.hasOwn(fields, "count")) {
      updateFields.count = fields.count;
    }

    if (Object.hasOwn(fields, "duration")) {
      updateFields.duration = fields.duration;
    }

    const setString = Object.keys(updateFields)
      .map((key, i) => `"${key}"=$${i + 1}`)
      .join(", ");
    // console.log(setString);
    const {
      rows: [updatedRoutineActivity],
    } = await client.query(
      `
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(updateFields)
    );

    return updatedRoutineActivity;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try{

    await client.query(`
    DELETE FROM routine_activities
    WHERE id=${id};`)

    return {"id": id} 
    //why does this want an object with id in it returned?

}catch(error){
  throw error;
}
}
async function canEditRoutineActivity(routineActivityId, userId) {
  try {

    const { rows: routineActivities } = await client.query(`
    SELECT *
    FROM routines r
    JOIN routine_activities ra ON ra."routineId" = r.id
    WHERE "routineId"=${routineActivityId} AND "creatorId"=${userId};
    `)

    // console.log(routineActivities)

return routineActivities.length !== 0;

  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};

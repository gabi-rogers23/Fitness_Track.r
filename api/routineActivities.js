const express = require("express");
const router = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  try {
    const routineActivity = await getRoutineActivityById(
      req.params.routineActivityId
    );
    // console.log("ROUTINE ACTIVITY: ", routineActivity)
    const routine = await getRoutineById(routineActivity.routineId);
    // console.log("ROUTINE: ", routine, routine.creatorId, req.user.id)

    if (routine.creatorId === req.user.id) {
      req.body.id = req.params.routineActivityId;
      const updatedRa = await updateRoutineActivity(req.body);
      // console.log("UPDATED RA: ", updatedRa)
      res.send(updatedRa);
    } else {
      res.status(403).send({
        error: "403 Forbidden",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        name: "Forbidden Access",
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  try {
    const routineActivity = await getRoutineActivityById(
      req.params.routineActivityId
    );
    // console.log("ROUTINE ACTIVITY: ", routineActivity)
    const routine = await getRoutineById(routineActivity.routineId);
    // console.log("ROUTINE: ", routine, routine.creatorId, req.user.id)
    if (routine.creatorId === req.user.id) {
      const deletedRa = await getRoutineActivityById(
        req.params.routineActivityId
      );
      await destroyRoutineActivity(req.params.routineActivityId);

      res.send(deletedRa);
    } else {
      res.status(403).send({
        error: "403 Forbidden",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
        name: "Forbidden Access",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

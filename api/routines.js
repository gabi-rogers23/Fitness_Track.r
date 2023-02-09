const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db");
const router = express.Router();
const { requireUser } = require("./utils");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  try {
    req.body.creatorId = req.user.id;
    const newRoutineData = await createRoutine(req.body);
    res.send(newRoutineData);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const userCheck = await getRoutineById(req.params.routineId);

    // console.log("ROUTINE USER ID: ",userCheck.creatorId, " | CURRENT USER ID: ",req.user.id);

    if (userCheck.creatorId === req.user.id) {
      req.body.id = req.params.routineId;
      const updatedRoutine = await updateRoutine(req.body);
      //   console.log("UPDATED ROUTINE: ", updatedRoutine);
      res.send(updatedRoutine);
    } else {
      res.status(403).send({
        error: "403 Forbidden",
        message: `User ${req.user.username} is not allowed to update ${userCheck.name}`,
        name: "Forbidden Access",
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const userCheck = await getRoutineById(req.params.routineId);
    if (userCheck.creatorId === req.user.id) {
      const deletedRoutine = await destroyRoutine(req.params.routineId);
      // console.log("DELETED ROUTINE: ", userCheck);
      res.send(userCheck);
    } else {
      res.status(403).send({
        error: "403 Forbidden",
        message: `User ${req.user.username} is not allowed to delete ${userCheck.name}`,
        name: "Forbidden Access",
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  try {
    console.log(req.params);
    const routineActivities = await getRoutineActivitiesByRoutine({
      id: req.params.routineId,
    });
    const attachedActivities = routineActivities.map(
      (routineActivity) => routineActivity.activityId
    );

    if (attachedActivities.includes(req.body.activityId)) {
      res.status(400).send({
        error: "400 Activity Exists ",
        message: `Activity ID ${req.body.activityId} already exists in Routine ID ${req.params.routineId}`,
        name: "This Activity already exists for this Routine",
      });
    } else {
      const addActivity = await addActivityToRoutine(req.body);
      res.send(addActivity);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

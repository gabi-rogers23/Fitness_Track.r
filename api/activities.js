const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  getPublicRoutinesByActivity,
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
} = require("../db");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  try {
    const activity = await getActivityById(req.params.activityId);
    if (activity === undefined) {
      res.status(404).send({
        error: "404 Not Found",
        message: `Activity ${req.params.activityId} not found`,
        name: "No Activity Found",
      });
    } else {
      const routines = await getPublicRoutinesByActivity(activity);
      res.send(routines);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const postData = {};
  try {
    const allActivities = await getAllActivities();

    const allNames = allActivities.map((activity) => activity.name);

    if (allNames.includes(name)) {
      res.status(400).send({
        error: "400 Activity Already Exists",
        message: `An activity with name ${name} already exists`,
        name: "Duplicate Activity",
      });
    } else {
      postData.name = name;
      postData.description = description;
      const activity = await createActivity(postData);
      res.send(activity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const activityId = req.params.activityId;
  const { name, description } = req.body;
  const updateFields = {};
  try {

    const currentActivity = await getActivityById(activityId)

  if(!currentActivity){
    res.status(400).send({
      error: "400 Activity does not exist",
      message: `Activity ${activityId} not found`,
      name: "Activity Not Found",
    })
  }

  if (description) {
    updateFields.description = description;
  }

    if (name) {
      const allActivities = await getAllActivities();

      const allNames = allActivities.map((activity) => activity.name);

      if (allNames.includes(name)) {
        res.status(400).send({
          error: "400 Activity Already Exists",
          message: `An activity with name ${name} already exists`,
          name: "Duplicate Activity",
        });
      } else {
        updateFields.name = name;
      }
    }
    updateFields.id = activityId;
      const updatedActivity = await updateActivity({updateFields});
      // console.log("UPDATED ACTIVITY: ", updatedActivity);
      res.send(updatedActivity);
  }catch(error){
    next(error);
  }
});

module.exports = router;

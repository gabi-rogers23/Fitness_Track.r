const express = require('express');
const router = express.Router();
const { 
  getPublicRoutinesByActivity,
  getAllActivities,
  getActivityById
 } = require("../db")

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async  (req, res, next) => {
    try{
        const activity = await getActivityById(req.params.activityId)
        const routines = await getPublicRoutinesByActivity(activity)
        res.send(routines)
    }catch(error){
        next(error);
    }
})
// GET /api/activities

router.get("/", async  (req, res, next) => {
  try{
      const activities = await getAllActivities()
      res.send(activities)
  }catch(error){
      next(error);
  }
})

// POST /api/activities

// PATCH /api/activities/:activityId

// :)

module.exports = router;

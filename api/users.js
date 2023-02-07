/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

// POST /api/users/register
router.post("/register", async(req, res, next)=> {
    
    try{
        
    }catch(error){
        next(error);
    }
})

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;

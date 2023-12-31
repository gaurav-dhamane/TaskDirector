const express = require('express')
const router = express.Router()
const teamController = require('../controllers/teamController')
const verifyJWT = require('../middleware/verifyJWT')



router.route('/')
    .get(teamController.getAllTeams)
    .post(teamController.createNewTeam)
    .patch(teamController.updateTeam)
    .delete(teamController.deleteTeam)

module.exports = router

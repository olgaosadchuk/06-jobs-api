const express = require('express');
const router = express.Router();
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob
} = require('../controllers/jobs');
const authenticateUser = require('../middleware/authentication');

router.route('/')
  .post(authenticateUser, createJob) // Create a job
  .get(authenticateUser, getAllJobs); // Get all jobs

router.route('/:id')
  .get(authenticateUser, getJob) // Get a specific job
  .patch(authenticateUser, updateJob) // Update a job
  .delete(authenticateUser, deleteJob); // Delete a job

module.exports = router;
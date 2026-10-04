const express = require("express");

const {
  projectData,
  getProjects,
  updateProjectStatus,
  updateProjectCriticScore,
  deleteProject
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, projectData);

router.get("/", protect, getProjects);

router.patch("/:projectId/status", protect, updateProjectStatus);
router.patch("/:projectId/critic-score", protect, updateProjectCriticScore);
router.delete("/:projectId", protect, deleteProject);

module.exports = router;
const mongoose = require("mongoose");
const Project = require("../models/project");

const projectData = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.id
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateProjectStatus = async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({
      message: "Invalid project ID"
    });
  }

  if (!["Active", "Completed"].includes(status)) {
    return res.status(400).json({
      message: "Status must be Active or Completed"
    });
  }

  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId: req.user.id
      },
      { status },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateProjectCriticScore = async (req, res) => {
  const { projectId } = req.params;
  const { criticScore } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({
      message: "Invalid project ID"
    });
  }

  if (typeof criticScore !== "number" || !Number.isFinite(criticScore) || criticScore < 0 || criticScore > 100) {
    return res.status(400).json({
      message: "Critic score must be a number between 0 and 100"
    });
  }

  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        userId: req.user.id
      },
      { criticScore },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({
      message: "Invalid project ID"
    });
  }

  try {
    const project = await Project.findOneAndDelete({
      _id: projectId,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    return res.status(200).json({
      message: "Project deleted successfully",
      projectId
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  projectData,
  getProjects,
  updateProjectStatus,
  updateProjectCriticScore,
  deleteProject
};
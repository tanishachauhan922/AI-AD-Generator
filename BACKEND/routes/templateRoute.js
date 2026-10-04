const express = require("express");

const { getonetemplate,templateput,createTemplate ,deleteTemplate } = require("../controllers/templateController");
//const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", templateput);
router.post("/", createTemplate);
router.get("/:id", getonetemplate);
router.delete("/:id", deleteTemplate);

module.exports = router;
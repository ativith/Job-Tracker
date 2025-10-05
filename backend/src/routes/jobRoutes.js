const express = require("express");
const {
  createJobs,
  getjobs,
  updatejobs,
  deletejobs,
} = require("../controllers/jobControllers");
const { protect } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");
const router = express.Router();

router.get("/getjobs", protect, getjobs);
router.post("/addnewjobs", protect, createJobs);
router.put("/updatejobs/:id", protect, updatejobs);
router.post("/deletejobs/:id", protect, deletejobs);

module.exports = router;

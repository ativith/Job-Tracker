const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  updateProfile,
  getUserProfile,
} = require("../controllers/userController");
const router = express.Router();

router.put("/updateprofile", protect, updateProfile);
router.get("/getuserprofile", protect, getUserProfile);

module.exports = router;

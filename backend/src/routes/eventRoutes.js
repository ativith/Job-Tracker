const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addEvents,
  getEvents,
  updateEvents,
  deleteEvents,
} = require("../controllers/eventController");
const router = express.Router();

router.get("/getevents", protect, getEvents);
router.post("/addevents", protect, addEvents);
router.put("/updateevents/:id", protect, updateEvents);
router.delete("/deleteevents/:id", protect, deleteEvents);

module.exports = router;

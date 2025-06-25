const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const ScheduleData = require('../../models/Schedule');
const User = require('../../models/User');

// @route   GET api/schedules
// @desc    Get user's schedule data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const scheduleData = await ScheduleData.findOne({ user: req.user.id });
    if (!scheduleData) {
      // If no data, create initial structure
      const newScheduleData = new ScheduleData({ user: req.user.id });
      await newScheduleData.save();
      return res.json(newScheduleData);
    }
    res.json(scheduleData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/schedules
// @desc    Create or update user's schedule data
// @access  Private
router.post('/', auth, async (req, res) => {
  const { scenarios, activeScenarioIndex } = req.body;

  const scheduleDataFields = {
    user: req.user.id,
    scenarios,
    activeScenarioIndex,
  };

  try {
    let scheduleData = await ScheduleData.findOneAndUpdate(
      { user: req.user.id },
      { $set: scheduleDataFields },
      { new: true, upsert: true }
    );
    res.json(scheduleData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST api/schedules/combinations
// @desc    Calculate and return valid schedule combinations
// @access  Private
router.post('/combinations', auth, (req, res) => {
  const { activities, days, timeSlots } = req.body;

  // --- Combination Logic (moved from frontend) ---
  
  const getAllCombinations = (
    activities,
    index,
    currentCombination = [],
    allCombinations = []
  ) => {
    if (index >= activities.length) {
      allCombinations.push([...currentCombination]);
      return;
    }
  
    const activity = activities[index];
    for (const scheduleOption of activity.scheduleOptions) {
      currentCombination.push({
        ...scheduleOption,
        name: activity.name,
        color: activity.color,
        totalScheduleOptions: activity.scheduleOptions.length,
      });
      getAllCombinations(activities, index + 1, currentCombination, allCombinations);
      currentCombination.pop();
    }
    return allCombinations;
  };

  const hasConflict = (scheduleCombination) => {
    for (const day of days) {
      for (const timeSlot of timeSlots) {
        const schedulesInCell = scheduleCombination.filter(
          (schedule) => schedule.timeTable[day]?.[timeSlot]
        );
        if (schedulesInCell.length > 1) {
          return true; // Conflict found
        }
      }
    }
    return false; // No conflicts
  };
  
  // --- Main Logic ---

  try {
    const allCombinations = getAllCombinations(activities, 0);
    const validCombinations = allCombinations.filter(combo => !hasConflict(combo));
    
    res.json(validCombinations);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});


module.exports = router; 
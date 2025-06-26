import express from 'express';
import auth from '../../middleware/auth.js';

import ScheduleData from '../../models/Schedule.js';

const router = express.Router();


/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get user's schedule data
 *     description: Get user's schedule data
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's schedule data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleData'
 *       500:
 *         description: Server error
 */

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
    res.status(500).json({ msg: 'Server error' });
  }
});


/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create or update user's schedule data
 *     description: Create or update user's schedule data
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleData'
 *     responses:
 *       200:
 *         description: The updated schedule data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleData'
 *       500:
 *         description: Server error
 */

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
    res.status(500).json({ msg: 'Server error' });
  }
});



/**
 * @swagger
 * /api/schedules/combinations:
 *   post:
 *     summary: Calculate and return valid schedule combinations
 *     description: Calculate and return valid schedule combinations
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activities:
 *                 type: array
 *               days:
 *                 type: array
 *               timeSlots:
 *                 type: array
 *     responses:
 *       200:
 *         description: The valid schedule combinations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Server error
 */

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
    res.status(500).json({ msg: 'Server error' });
  }

});


export default router; 
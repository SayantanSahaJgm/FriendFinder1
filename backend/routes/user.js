const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import the User model

// API to update user location
router.post("/update-location", async (req, res) => {
    try {
        const { userId, latitude, longitude } = req.body;

        // Validate input
        if (!userId || !latitude || !longitude) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find user in the database
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update user location
        user.location = { latitude, longitude };
        await user.save();

        res.json({ message: "Location updated successfully" });
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/nearby", async (req, res) => {
    const { userId, nearbyUsers, method } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Store nearby users in the database
    user.discoveryMethod = method;
    await user.save();

    res.json({ message: "Nearby users updated" });
});

router.get("/nearby/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Get users within a 5km radius (Example)
        const nearbyUsers = await User.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [user.location.longitude, user.location.latitude] },
                    $maxDistance: 5000, // 5km range
                },
            },
        });

        res.json({ nearbyUsers });
    } catch (error) {
        console.error("Error fetching nearby users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router; // Ensure the router is exported


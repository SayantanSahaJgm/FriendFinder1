const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    location: {
        latitude: Number,
        longitude: Number,
    },
    online: Boolean,
    discoveryMethod: String,  // "WiFi", "Bluetooth", or "Location"
});

module.exports = mongoose.model("User", UserSchema);

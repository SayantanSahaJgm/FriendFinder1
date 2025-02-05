import React, { useEffect, useState } from "react";
import Peer from "simple-peer";

// Replace this with dynamic user authentication (e.g., from localStorage)
const CURRENT_USER_ID = "12345"; // Temporary static value

// Function to send nearby users to the backend API
async function sendNearbyUsers(nearbyUsers, method) {
    await fetch("http://localhost:5000/api/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: CURRENT_USER_ID,
            nearbyUsers,
            method,
        }),
    });
}

// Function to update user's location in the backend
async function updateLocation(latitude, longitude) {
    await fetch("http://localhost:5000/api/users/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: CURRENT_USER_ID,
            latitude,
            longitude,
        }),
    });
}

// Function to get nearby users based on location
async function fetchNearbyUsers() {
    const response = await fetch(`http://localhost:5000/api/users/nearby/${CURRENT_USER_ID}`);
    const data = await response.json();
    return data.nearbyUsers; // Array of nearby users
}

// Bluetooth-based Nearby Friend Discovery
async function scanForNearbyDevices() {
    try {
        console.log("Scanning for Bluetooth devices...");

        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true, // Allow all devices
            optionalServices: ["battery_service", "device_information"], // Common services
        });

        console.log("Connected to device:", device.name || "Unnamed Device");

        // Get all services to debug
        const server = await device.gatt.connect();
        const services = await server.getPrimaryServices();

        console.log("Available services:");
        services.forEach((service) => console.log(service.uuid));

        alert(`Found Bluetooth friend: ${device.name || "Unnamed Device"}`);

        // Send to server
        await sendNearbyUsers([{ id: device.id, name: device.name || "Unnamed Device" }], "bluetooth");
    } catch (error) {
        console.error("Bluetooth scan failed:", error);
    }
}



// WiFi-based Nearby Friend Discovery (Using simple-peer)
function startWiFiDiscovery() {
    const peer = new Peer({ initiator: true, trickle: false });

    peer.on("signal", async (data) => {
        console.log("Found nearby peer:", data);

        const nearbyUsers = [{ id: "wifiUser1", name: "WiFi Friend" }];
        await sendNearbyUsers(nearbyUsers, "wifi");

        alert("Nearby WiFi friends sent to server!");
    });

    peer.on("connect", () => {
        console.log("Connected to a WiFi peer!");
    });

    peer.on("error", (err) => {
        console.error("Peer connection error:", err);
    });

    // Simulate a connection by signaling with a test WebRTC peer
    setTimeout(() => {
        peer.signal({ type: "offer", sdp: "dummy-sdp-data" });
    }, 1000);
}


function NearbyFriends() {
    const [location, setLocation] = useState(null);
    const [nearbyUsers, setNearbyUsers] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const newLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            };
            setLocation(newLocation);

            // Send updated location to backend
            await updateLocation(newLocation.lat, newLocation.lng);

            // Fetch nearby users
            const users = await fetchNearbyUsers();
            setNearbyUsers(users);
        });
    }, []);

    return (
        <div>
            <h2>Find Nearby Friends</h2>

            {/* Bluetooth Scan Button */}
            <button onClick={scanForNearbyDevices}>
                Scan for Nearby Friends (Bluetooth)
            </button>

            {/* WiFi Scan Button */}
            <button onClick={startWiFiDiscovery}>
                Scan for Nearby Friends (WiFi)
            </button>

            {/* Display Nearby Users */}
            <h3>Nearby Friends (Location-Based)</h3>
            <ul>
                {nearbyUsers.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default NearbyFriends;

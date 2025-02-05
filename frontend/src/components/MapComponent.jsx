import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const center = { lat: 0, lng: 0 }; // Default center (will update based on user's location)

const MapComponent = ({ userId }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Get user’s current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting user location", error);
            }
        );
    }, []);

    useEffect(() => {
        if (userId && userLocation) {
            axios
                .get(`http://localhost:5000/api/nearby-friends?userId=${userId}`)
                .then((response) => {
                    setFriends(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching nearby friends", error);
                });
        }
    }, [userId, userLocation]);

    return (
        <LoadScript googleMapsApiKey="AIzaSyBCXR087zCXzt7eQOP7_Zl1ZdJyXWXKIcI">
            <GoogleMap mapContainerStyle={containerStyle} center={userLocation || center} zoom={12}>
                {userLocation && <Marker position={userLocation} label="You" />}
                {friends.map((friend, index) => (
                    <Marker key={index} position={friend.location} label={friend.name} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;

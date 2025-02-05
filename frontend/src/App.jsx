import React from "react";
import MapComponent from "./components/MapComponent";
import NearbyFriends from "./components/NearbyFriends";

function App() {
  const userId = "your-user-id"; // Replace with the logged-in user’s ID

  return (
    <div className="container">
      <div className="flex flex-col ">
        <h1>Find Nearby Friends</h1>
        <MapComponent userId={userId} />
        <NearbyFriends />
      </div>
    </div>
  );
}

export default App;

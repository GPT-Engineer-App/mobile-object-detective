import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [sensitivity, setSensitivity] = useState(0.5);
  const [objectCategories, setObjectCategories] = useState(["person", "car"]);
  const [notifications, setNotifications] = useState(true);

  const handleSensitivityChange = (e) => setSensitivity(e.target.value);
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setObjectCategories((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((category) => category !== value)
        : [...prevCategories, value]
    );
  };
  const handleNotificationChange = () => setNotifications((prev) => !prev);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Settings</h1>
      <div className="flex flex-col space-y-4">
        <div>
          <label>Sensitivity: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={sensitivity}
            onChange={handleSensitivityChange}
          />
        </div>
        <div>
          <label>Object Categories: </label>
          <div>
            <label>
              <input
                type="checkbox"
                value="person"
                checked={objectCategories.includes("person")}
                onChange={handleCategoryChange}
              />
              Person
            </label>
            <label>
              <input
                type="checkbox"
                value="car"
                checked={objectCategories.includes("car")}
                onChange={handleCategoryChange}
              />
              Car
            </label>
            {/* Add more categories as needed */}
          </div>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={handleNotificationChange}
            />
            Enable Notifications
          </label>
        </div>
        {currentUser && (
          <Button onClick={logout}>Logout</Button>
        )}
      </div>
    </div>
  );
};

export default Settings;
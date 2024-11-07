import React from "react";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const name = data.name;
    const value = data.value / 1000; // Convert milliseconds to seconds
    const color = data.payload.fill || "#000"; // Fallback to black if color is undefined

    // Format the value as HH:MM:SS
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.floor(value % 60);
    const formattedValue = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return (
      <div
        className="custom-tooltip p-2 rounded shadow-lg flex items-center"
        style={{
          backgroundColor: "#090B09",
          border: "1px solid #ccc",
        }}
      >
        {/* Color Indicator */}
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: color,
            borderRadius: "50%",
            marginRight: "8px",
          }}
        ></div>
        {/* Tooltip Text */}
        <div>
          <p className="label text-sm font-medium">{`Topic: ${name}`}</p>
          <p className="value text-xs text-secondary-foreground">{`Time Studied: ${formattedValue}`}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;

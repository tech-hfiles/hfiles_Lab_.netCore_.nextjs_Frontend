import React from "react";

const infoCards = [
  {
    title: "Arrow Beside The Date (inside Patients-list):",
    message:
      'Click this to select a different date range using the “From” and “To” options. This allows you to filter and view patient reports sent during a specific period.',
  },
  {
    title: "Reload Icon (top-right corner):",
    message:
      "Click this to reset the filters and return to the default view, showing the current date's reports.",
  },
  {
    title: "“See More” Button:",
    message:
      "Click this to view full report details for that particular patient.",
  },
];

const HomeInformation = () => {
  return (
    <div className="space-y-1">
      <p className="text-blue-800 font-bold text-md">Section Overview</p>
      <div className="border border-black mb-3" />

      {infoCards.map((card, index) => (
        <div key={index} className="border border-gray-400 bg-gray-100 rounded-md p-4 shadow-sm">
          <p className="font-semibold">{card.title}</p>
          <p className="text-sm text-gray-700 mt-1">{card.message}</p>
        </div>
      ))}
    </div>
  );
};

export default HomeInformation;

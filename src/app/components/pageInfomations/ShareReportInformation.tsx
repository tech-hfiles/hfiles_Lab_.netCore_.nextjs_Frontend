import React from 'react'

const infoCards = [
  {
    title: "Search Bar:",
    message: "You can search reports by category name to instantly narrow down the report list without scrolling. Ex: Dental, Radiology, Immunization, etc.",
  },
  {
    title: "Dropdown (ALL Reports):",
    message: "Use this to filter reports by category to quickly find specific types of shared reports.",
  },
  {
    title: 'Resend Button:',
    message: "Use the 'Resend' button below to resend selected reports to the respective user. Multiple reports can be resent at once.",
  },
];

const ShareReportInformation = () => {
  return (
    <div className="space-y-1">
      <h1 className="text-blue-800 font-bold text-md">Section Overview</h1>
      <div className="border border-black mb-3" />

      {infoCards.map((card, index) => (
        <div key={index} className="border border-gray-400 bg-gray-100 rounded-md p-4 shadow-sm">
          <p className="font-semibold">{card.title}</p>
          <p className="text-sm text-gray-700 mt-1">{card.message}</p>
        </div>
      ))}
    </div>
  )
}

export default ShareReportInformation
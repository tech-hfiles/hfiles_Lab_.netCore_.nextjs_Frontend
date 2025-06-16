import React from "react"; 
 
const infoCards = [ 
  { 
    title: "Plus Icon (left side):", 
    message: 
      "Click the plus icon to add another patient and send reports to multiple users in a single action.", 
  }, 
  { 
    title: "Upload Button:", 
    message: 
      "Use the 'Upload' button to select and attach the report file before sending.", 
  }, 
  { 
    title: "Add More Button:", 
    message: 
      "Click 'Add More' to send another report to the same patient. Alternatively, you can change the report category directly without using the 'Add More' button to send another report.", 
  }, 
]; 
 
const FormInformation = () => { 
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
  ); 
}; 
 
export default FormInformation;
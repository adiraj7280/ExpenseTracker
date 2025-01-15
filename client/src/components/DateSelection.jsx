// import React from 'react';

// const DateSelection = ({ startDate, setStartDate, endDate, setEndDate }) => {
//     const handleEndDateChange = (e) => {
//         const selectedDate = e.target.value;
//         if (new Date(selectedDate) < new Date(startDate)) {
//             alert('End date cannot be earlier than the start date.');
//         } else {
//             setEndDate(selectedDate);
//         }
//     };

//     return (
//         <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
//             <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
//             <div className="flex gap-4">
//                 <div className="flex-1">
//                     <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
//                     <input
//                         type="date"
//                         value={startDate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                         className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                     />
//                 </div>
//                 <div className="flex-1">
//                     <label className="block text-gray-700 font-semibold mb-2">End Date</label>
//                     <input
//                         type="date"
//                         value={endDate}
//                         onChange={handleEndDateChange}
//                         className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DateSelection;

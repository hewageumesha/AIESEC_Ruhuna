import React from "react";


const EventPage = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center">
          <input type="text" placeholder="Search for data & reports..." className="p-2 border rounded w-1/3" />
          <button className="bg-[#037ef3] text-white px-4 py-2 rounded"> ADD EVENT</button>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-[#037ef3]  to-blue-400 p-4 rounded shadow-md text-white">
            <p className="text-2xl">Upcoming Events </p>
            <p>4 </p>
          </div>
          <div className="bg-gradient-to-r from-[#037ef3]  to-blue-400 p-4 rounded shadow-md text-white">
            <p className="text-2xl">Total Participants</p>
            <p>78</p>
          </div>
          <div className="bg-gradient-to-r from-[#037ef3]  to-blue-400 p-4 rounded shadow-md text-white">
            <p className="text-2xl">Completed Events</p>
            <p>3</p>
          </div>
          <div className="bg-gradient-to-r from-[#037ef3]  to-blue-400 p-4 rounded shadow-md text-white">
            <p className="text-2xl">Total Events</p>
            <p>10</p>
          </div>
        </div>
        
        {/* Incoming Reservations */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Incoming Events</h2>
          <table className="w-full mt-4 bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Event ID</th>
                <th className="p-3 text-left">EventName</th>
                <th className="p-3 text-left">AISEC Email</th>
                <th className="p-3 text-left">Countdown</th>
               
              </tr>
            </thead>
            <tbody>
              {[
                { order: 257, name: "Amirul farhan", email: "muhammadamirul5703@gmail.com", package: "1 day more" },
                { order: 258, name: "Amirul farhan", email: "muhammadamirul5703@gmail.com", package: "1 week more" },
                { order: 259, name: "Amirul farhan", email: "muhammadamirul5703@gmail.com", package: "Standard" },
                { order: 260, name: "Amirul farhan", email: "muhammadamirul5703@gmail.com", package: "2 weeks more" },
                { order: 261, name: "Amirul amir", email: "muhammadamirul5703@gmail.com", package: "1 month more" },
                { order: 263, name: "Amirul amir", email: "muhammadamirul57032@gmail.com", package: "1 month more" }
              ].map((reservation, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{reservation.order}</td>
                  <td className="p-3">{reservation.name}</td>
                  <td className="p-3">{reservation.email}</td>
                  <td className="p-3">
                    <span className="bg-[#037ef3] text-black px-2 py-1 rounded">{reservation.package}</span>
                  </td>
                  <td className="p-3">{reservation.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default EventPage;

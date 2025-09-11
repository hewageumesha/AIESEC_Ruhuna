import React, { useState } from "react";
import GuestRegistrationModal from "../components/registration/GuestRegistrationModal";

const PublicEventPage = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Your event details here */}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Register Now
      </button>

      <GuestRegistrationModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event.id}
        onRegister={(data) => {
          console.log("Guest Registered ✅", data);
        }}
      />
    </>
  );
};

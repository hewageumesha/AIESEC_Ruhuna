import { useState } from 'react';
import EventRegistrationModal from './EventRegistrationModal';

const RegistrationButton = ({ event, user }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register Now
      </button>
      <EventRegistrationModal
  open={open}
  onClose={() => setOpen(false)}
  event={event}
  user={user}
/>

    </>
  );
};

export default RegistrationButton;

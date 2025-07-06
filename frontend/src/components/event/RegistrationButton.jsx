import { useState } from 'react';
import MemberRegistrationModal from './MemberRegistrationModal';
import GuestRegistrationModal from './GuestRegistrationModal';

const RegistrationButton = ({ event, user }) => {
  const [visible, setVisible] = useState(false);

  const isMember = user && ['LCP', 'LCVP', 'Team_Leader', 'Member'].includes(user.role);

  return (
    <>
      <button
        onClick={() => setVisible(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register Now
      </button>

      {isMember ? (
        <MemberRegistrationModal
          visible={visible}
          onClose={() => setVisible(false)}
          eventId={event.eventId}
        />
      ) : (
        <GuestRegistrationModal
          visible={visible}
          onClose={() => setVisible(false)}
          eventId={event.eventId}
        />
      )}
    </>
  );
};


export default RegistrationButton;

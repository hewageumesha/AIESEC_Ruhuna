import { useState } from 'react';
import MemberRegistrationModal from './MemberRegistrationModal';
import GuestRegistrationModal from './GuestRegistrationModal';
import { useState } from "react";
import { message } from "antd";
import { UserPlus } from "lucide-react"; // you can replace with your icon library
import MemberRegistrationModal from "./MemberRegistrationModal";
import GuestRegistrationModal from "./GuestRegistrationModal";

const AIESEC_BLUE = "#0072C6";

const RegistrationButton = ({ event, user }) => {
  const [visible, setVisible] = useState(false);

  const isMember = user && ['LCP', 'LCVP', 'Team_Leader', 'Member'].includes(user.role);
  const isMember =
    user && ["LCP", "LCVP", "Team_Leader", "Member"].includes(user.role);

  const handleClick = () => {
    if (isMember) {
      setVisible(true);
    } else {
      if (!event.isPublic) {
        message.warning(
          "This is a private event. Only AIESEC members can register."
        );
        return;
      }
      setVisible(true);
    }
  };

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
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0072C6] text-white font-semibold shadow-md hover:bg-[#005a9e] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Register for event"
      >
        <UserPlus className="w-5 h-5" />
        Register Now
      </button>

      {visible &&
        (isMember ? (
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
        ))}
    </>
  );
};


export default RegistrationButton;

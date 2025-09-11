import React from "react";
import { Modal } from "antd";
import GuestRegistrationForm from "./GuestRegistrationForm";

const GuestRegistrationModal = ({ visible, onClose, eventId, onRegister }) => {
  if (!eventId) {
    console.warn("⚠️ GuestRegistrationModal: Missing eventId");
  }

  return (
    <Modal
      open={visible}                // ✅ Correct Ant Design prop
      title="Guest Event Registration"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {eventId ? (
        <GuestRegistrationForm
          eventId={eventId}
          onSuccess={(data) => {
            console.log("✅ Guest registration succeeded:", data);
            onRegister?.(data);     // optional chaining
            onClose();
          }}
        />
      ) : (
        <div style={{ padding: "1rem", color: "red", fontWeight: 500 }}>
          ⚠️ Cannot load form: Event ID is missing.
        </div>
      )}
    </Modal>
  );
};

export default GuestRegistrationModal;

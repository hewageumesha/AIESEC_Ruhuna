import React from "react";
import { Modal } from "antd";
import GuestRegistrationForm from "./GuestRegistrationForm";

const GuestRegistrationModal = ({ visible, onClose, eventId, onRegister }) => {
  return (
    <Modal
     visible={visible}
      title="Guest Event Registration"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
     <GuestRegistrationForm
        eventId={eventId}
        onSuccess={(data) => {
          onRegister?.(data);
          onClose();
        }}
      />
    </Modal>
  );
};


export default GuestRegistrationModal;
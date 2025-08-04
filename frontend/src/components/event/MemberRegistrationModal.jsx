import React from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import MemberRegistrationForm from "./MemberRegistrationForm";

const MemberRegistrationModal = ({ visible, onClose, eventId, onRegister }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Modal
       visible={visible} 
      title="Event Response"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <MemberRegistrationForm
        eventId={eventId}
        member={currentUser}
         onSuccess={(data) => {
          onRegister?.(data);
          onClose();
        }}
      />
    </Modal>
  );
};

export default MemberRegistrationModal;

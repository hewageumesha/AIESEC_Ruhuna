import React from 'react';
import { Modal, Tabs } from 'antd';
import MemberRegistrationForm from './MemberRegistrationForm';
import GuestRegistrationForm from './GuestRegistrationForm';

const { TabPane } = Tabs;

const EventRegistrationModal = ({ isModalOpen, setIsModalOpen, eventId, userId }) => {
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      destroyOnHidden={true}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="AIESEC Member" key="1">
          <MemberRegistrationForm userId={userId} eventId={eventId} onClose={handleCancel} />
        </TabPane>
        <TabPane tab="Guest" key="2">
          <GuestRegistrationForm eventId={eventId} onClose={handleCancel} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EventRegistrationModal;

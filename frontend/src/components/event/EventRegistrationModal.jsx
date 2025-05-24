import React from 'react';
import { Modal, Tabs } from 'antd';
import MemberRegistrationForm from './MemberRegistrationForm';
import GuestRegistrationForm from './GuestRegistrationForm';

const { TabPane } = Tabs;

const EventRegistrationModal = ({ isModalOpen, setIsModalOpen }) => {
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen} // ✅ replaces deprecated "visible"
      destroyOnHidden={true} // ✅ replaces deprecated "destroyOnClose"
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="AIESEC Member" key="1">
          <MemberRegistrationForm closeModal={handleCancel} />
        </TabPane>
        <TabPane tab="Guest" key="2">
          <GuestRegistrationForm closeModal={handleCancel} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EventRegistrationModal;

import React from 'react';
import { Modal, Button } from 'flowbite-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor = 'red', isLoading }) => {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>Cancel</Button>
        <Button color={confirmColor} onClick={onConfirm} disabled={isLoading}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Select } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { addMember, updateMember, fetchCommittee } from '../redux/user/committeeSlice';
import { toast } from 'react-toastify';

const MemberModal = ({ isOpen, onClose, member, mode, currentUserRole, currentUserDepartment, currentUserTeam }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    team: '',
    role: mode || 'Member',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        department: member.department || '',
        team: member.team || '',
        role: member.role || mode || 'Member',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: currentUserRole === 'LCVP' ? currentUserDepartment : '',
        team: currentUserRole === 'Team_Leader' ? currentUserTeam : '',
        role: mode || 'Member',
      });
    }
  }, [member, mode, currentUserDepartment, currentUserTeam, currentUserRole]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (member) {
        await dispatch(updateMember({ id: member._id, ...formData })).unwrap();
        toast.success('Member updated successfully!');
      } else {
        await dispatch(addMember(formData)).unwrap();
        toast.success('Member added successfully!');
      }
      dispatch(fetchCommittee());
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save member.');
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>{member ? 'Edit Member' : 'Add Member'}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="department" value="Department" />
            <TextInput id="department" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="team" value="Team" />
            <TextInput id="team" name="team" value={formData.team} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="role" value="Role" />
            <Select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="Member">Member</option>
              <option value="Team_Leader">Team Leader</option>
              <option value="LCVP">LCVP</option>
              <option value="LCP">LCP</option>
            </Select>
          </div>
          <Button type="submit" color="indigo">{member ? 'Update' : 'Add'}</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default MemberModal;

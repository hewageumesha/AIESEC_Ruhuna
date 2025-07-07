import React from 'react';
import { HiX } from 'react-icons/hi';

const MemberModal = ({ isOpen, onClose, member, currentUserRole, currentUserDepartment, currentUserTeam, mode }) => {
  if (!isOpen) return null;

  const isEditMode = !!member;
  const title = isEditMode ? `Edit ${mode}` : `Add New ${mode}`;

  // Form fields would vary based on mode (Member, Team_Leader, LCVP)
  // Implement your form fields and validation here

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <HiX className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-4">
          {/* Form fields would go here */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={member?.name || ''}
            />
          </div>
          {/* More fields for email, role, department, team, etc. */}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
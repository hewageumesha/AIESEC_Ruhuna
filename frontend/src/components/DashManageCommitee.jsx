import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Table, TableRow, TableCell } from "@/components/ui/table";

export default function DashManageCommittee() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", department: "" });
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingId !== null) {
      setMembers(members.map(m => (m.id === editingId ? { ...m, ...formData } : m)));
      setEditingId(null);
    } else {
      setMembers([...members, { id: members.length + 1, ...formData }]);
    }
    setFormData({ name: "", role: "", department: "" });
    setIsOpen(false);
  };

  const handleDelete = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleEdit = (member) => {
    setFormData({ name: member.name, role: member.role, department: member.department });
    setEditingId(member.id);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Committee</h1>
      <Button onClick={() => { setIsOpen(true); setEditingId(null); setFormData({ name: "", role: "", department: "" }); }}>+ Add Member</Button>
      
      <Table className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>
                <Button variant="secondary" onClick={() => handleEdit(member)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(member.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>{editingId !== null ? "Edit Member" : "Add New Member"}</ModalHeader>
        <ModalBody>
          <Input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="mb-2" />
          <Input name="role" placeholder="Role" value={formData.role} onChange={handleInputChange} className="mb-2" />
          <Input name="department" placeholder="Department" value={formData.department} onChange={handleInputChange} className="mb-2" />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit}>{editingId !== null ? "Update" : "Add"}</Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

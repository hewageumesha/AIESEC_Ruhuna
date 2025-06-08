import React from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Box,
  Avatar,
  Typography
} from '@mui/material';
import axios from 'axios';

const EditUserForm = ({ user, onCancel, onSave }) => {
  const [formData, setFormData] = React.useState({
    firstName: user.firstName,
    lastName: user.lastName,
    aiesecEmail: user.aiesecEmail,
    phone: user.phone,
    address: user.address,
    birthday: user.birthday,
    role: user.role,
    status: user.status,
    departmentId: user.departmentId,
    functionId: user.functionId,
    teamLeaderId: user.teamLeaderId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/users/${user.id}`, formData);
      onSave(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Edit User Profile
      </Typography>
      
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar 
          src={user.profilePicture} 
          sx={{ width: 60, height: 60, mr: 2 }}
        />
        <Button variant="outlined" size="small">
          Change Photo
        </Button>
      </Box>

      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      
      <TextField
        label="AIESEC Email"
        name="aiesecEmail"
        value={formData.aiesecEmail}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        type="email"
      />
      
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      
      <TextField
        label="Birthday"
        name="birthday"
        type="date"
        value={formData.birthday}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          label="Role"
        >
          <MenuItem value="LCP">LCP</MenuItem>
          <MenuItem value="LCVP">LCVP</MenuItem>
          <MenuItem value="Team_Leader">Team Leader</MenuItem>
          <MenuItem value="MEMBER">Member</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Status"
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
          <MenuItem value="ALUMNI">Alumni</MenuItem>
        </Select>
      </FormControl>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button onClick={onCancel} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserForm;
import React, { useState, useEffect } from 'react';
import { 
  Avatar, 
  Typography, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Button
} from '@mui/material';
import axios from 'axios';
import EditUserForm from './EditUserForm';

const UserDetails = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  if (editMode) {
    return (
      <EditUserForm 
        user={user} 
        onCancel={() => setEditMode(false)}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          setEditMode(false);
        }}
      />
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar 
          src={user.profilePicture} 
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box>
          <Typography variant="h5">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {user.role} • {user.departmentName}
          </Typography>
          <Chip 
            label={user.status} 
            size="small" 
            sx={{ mt: 1 }}
            color={user.status === 'ACTIVE' ? 'success' : 'default'}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <List dense>
        <ListItem>
          <ListItemText primary="AIESEC Email" secondary={user.aiesecEmail} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Phone" secondary={user.phone || 'Not provided'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Address" secondary={user.address || 'Not provided'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Birthday" secondary={user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Joined Date" secondary={new Date(user.joinedDate).toLocaleDateString()} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Function" secondary={user.functionName || 'Not assigned'} />
        </ListItem>
        {user.teamLeaderName && (
          <ListItem>
            <ListItemText primary="Team Leader" secondary={user.teamLeaderName} />
          </ListItem>
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="space-between">
        <Button 
          variant="outlined" 
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            // Handle actions
          }}
        >
          View Team
        </Button>
      </Box>
    </Box>
  );
};

export default UserDetails;
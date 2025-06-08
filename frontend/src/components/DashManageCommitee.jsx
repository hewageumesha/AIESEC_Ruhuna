import React, { useState, useEffect } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { Box, Typography, Avatar, Button, Modal } from '@mui/material';
import axios from 'axios';
import UserDetails from './UserDetails';


const CommitteeTreeList = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchCommitteeHierarchy();
  }, []);

  const fetchCommitteeHierarchy = async () => {
    try {
      const response = await axios.get('/api/users/hierarchy');
      setHierarchy(response.data);
    } catch (error) {
      console.error('Error fetching committee hierarchy:', error);
    }
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id.toString()}
      label={
        <Box display="flex" alignItems="center" p={1}>
          <Avatar 
            src={nodes.profilePicture} 
            sx={{ width: 40, height: 40, mr: 2 }}
            onClick={() => {
              setSelectedUser(nodes.id);
              setOpenModal(true);
            }}
            style={{ cursor: 'pointer' }}
          />
          <Box>
            <Typography variant="subtitle1">{nodes.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {nodes.role} • {nodes.departmentName}
            </Typography>
          </Box>
        </Box>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Committee Hierarchy
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" color="primary">
          Add New Member
        </Button>
      </Box>
      
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        sx={{ height: '70vh', overflow: 'auto' }}
      >
        {hierarchy.map((node) => renderTree(node))}
      </TreeView>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="user-details-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {selectedUser && <UserDetails userId={selectedUser} />}
        </Box>
      </Modal>
    </Box>
  );
};

export default CommitteeTreeList;
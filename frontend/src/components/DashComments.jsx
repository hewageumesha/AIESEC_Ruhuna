import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaUserCircle, FaPaperPlane, FaSearch, FaComment, FaCommentSlash, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import moment from 'moment';
import React from 'react';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'thisWeek', 'thisMonth'
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'oldest'

  // Check if current user is authorized (LCVP or LCP)
  const isAuthorized = currentUser?.role === 'LCVP' || currentUser?.role === 'LCP';
  const isLCVP = currentUser?.role === 'LCVP';

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    if (!isAuthorized) {
      toast.error('You are not authorized to view this page');
      navigate('/');
      return;
    }

    fetchMembersWithComments();
  }, [currentUser, navigate, isAuthorized]);

  const fetchMembersWithComments = async () => {
    try {
      setIsLoading(true);
      const membersRes = await axios.get('https://aiesec-ruhuna.vercel.app/api/users/members', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      console.log(membersRes.data);
      
      // Transform members data to include hasComments and lastCommentDate
      const membersWithCommentFlag = await Promise.all(
        membersRes.data.map(async member => {
          try {
            console.log(currentUser.role)
            const commentsRes = await axios.get(`https://aiesec-ruhuna.vercel.app/api/comments/member/${member.id}/${currentUser.role}`, {
              headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            
            return {
              ...member,
              hasComments: commentsRes.data.length > 0,
              lastCommentDate: commentsRes.data.length > 0 
                ? commentsRes.data[0].createdAt // Assuming sorted by createdAt desc
                : null
            };
          } catch (error) {
            console.error(`Failed to fetch comments for member ${member.id}:`, error);
            return {
              ...member,
              hasComments: false,
              lastCommentDate: null
            };
          }
        })
      );
      
      setMembers(membersWithCommentFlag);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMember) {
      fetchComments(selectedMember.id);
    }
  }, [selectedMember]);

  const fetchComments = async (memberId) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`https://aiesec-ruhuna.vercel.app/api/comments/member/${memberId}/${currentUser.role}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      
      // Transform comments to match frontend structure
      const formattedComments = res.data.map(comment => ({
        id: comment.id,
        memberId: memberId,
        content: comment.content,
        author: {
          firstName: comment.createdBy.firstName,
          lastName: comment.createdBy.lastName,
          aiesecEmail: comment.createdBy.aiesecEmail,
          profilePicture: '' // Add if available
        },
        createdAt: comment.createdAt
      }));
      
      setComments(formattedComments);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  };

  // Date filtering logic
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.aiesecEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!member.hasComments) return dateFilter === 'all' && matchesSearch;
    
    const lastCommentDate = member.lastCommentDate ? new Date(member.lastCommentDate) : null;
    if (!lastCommentDate) return matchesSearch;
    
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return matchesSearch && moment(lastCommentDate).isSame(now, 'day');
      case 'thisWeek':
        return matchesSearch && moment(lastCommentDate).isAfter(moment().subtract(7, 'days'));
      case 'thisMonth':
        return matchesSearch && moment(lastCommentDate).isAfter(moment().subtract(30, 'days'));
      default:
        return matchesSearch;
    }
  }).sort((a, b) => {
    if (sortOrder === 'recent') {
      if (!a.lastCommentDate) return 1;
      if (!b.lastCommentDate) return -1;
      return new Date(b.lastCommentDate) - new Date(a.lastCommentDate);
    } else {
      if (!a.lastCommentDate) return -1;
      if (!b.lastCommentDate) return 1;
      return new Date(a.lastCommentDate) - new Date(b.lastCommentDate);
    }
  });

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setSelectedMember(null); // Reset selected member when changing filters
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'recent' ? 'oldest' : 'recent');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    console.log(currentUser);

    try {
      const res = await axios.post('https://aiesec-ruhuna.vercel.app/api/comments/add', {
        content: newComment,
        memberId: selectedMember.id,
        creatorEmail: currentUser.aiesecEmail
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      
      // Refresh comments after adding new one
      await fetchComments(selectedMember.id);
      await fetchMembersWithComments();
      
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Only LCVP can add comments');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add comment');
      }
    }
  };

  const handleUpdateComment = async () => {
    try {
      await axios.put(`/api/comments/${editingCommentId}`, {
        content: editingContent
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      setComments(prev => prev.map(c =>
        c.id === editingCommentId ? { ...c, content: editingContent } : c
      ));
      setEditingCommentId(null);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`https://aiesec-ruhuna.vercel.app/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      
      setComments(prev => prev.filter(c => c.id !== id));
      await fetchMembersWithComments();
      
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  }; 

  if (!isAuthorized) {
    return null; // Or show a loading/unauthorized message
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Member Comments</h1>
      
      {/* Filter Section */}
      <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span className="font-medium">Time Period:</span>
            <button
              onClick={() => handleDateFilterChange('all')}
              className={`px-3 py-1 rounded-lg ${dateFilter === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'}`}
            >
              All Members
            </button>
            <button
              onClick={() => handleDateFilterChange('today')}
              className={`px-3 py-1 rounded-lg ${dateFilter === 'today' ? 'bg-blue-100 text-blue-700 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'}`}
            >
              Today
            </button>
            <button
              onClick={() => handleDateFilterChange('thisWeek')}
              className={`px-3 py-1 rounded-lg ${dateFilter === 'thisWeek' ? 'bg-blue-100 text-blue-700 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'}`}
            >
              This Week
            </button>
            <button
              onClick={() => handleDateFilterChange('thisMonth')}
              className={`px-3 py-1 rounded-lg ${dateFilter === 'thisMonth' ? 'bg-blue-100 text-blue-700 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'}`}
            >
              This Month
            </button>
          </div>
          <button
            onClick={toggleSortOrder}
            className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            <FaCalendarAlt className="mr-2" />
            {sortOrder === 'recent' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>
      
      {/* Member Selection */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 dark:text-gray-300" />
          </div>
          <input
            type="text"
            placeholder="Search members by name or AIESEC email..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select a member to {isLCVP ? 'view/add comments' : 'view comments'}
            {dateFilter !== 'all' && ` (Filtered by ${dateFilter})`}
          </h3>
          <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
            {filteredMembers.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-300">
                {searchTerm 
                  ? 'No members match your search'
                  : `No members with comments in the selected time frame (${dateFilter})`}
              </div>
            ) : (
              filteredMembers.map(member => (
                <div
                  key={member.id}
                  className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                    selectedMember?.id === member.id ? 'bg-blue-50 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-center">
                    {member.profilePicture ? (
                      <img 
                        src={member.profilePicture} 
                        alt="Member" 
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-gray-400 dark:text-gray-300 mr-3" />
                    )}
                    <div>
                      <p className="font-medium dark:text-gray-200">{member.firstName} {member.lastName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.aiesecEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {member.hasComments && member.lastCommentDate && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                        {moment(member.lastCommentDate).fromNow()}
                      </span>
                    )}
                    {member.hasComments ? (
                      <FaComment className="text-blue-500" title="Has comments" />
                    ) : (
                      <FaCommentSlash className="text-gray-400 dark:text-gray-400" title="No comments" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {selectedMember && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              {selectedMember.profilePicture ? (
                <img 
                  src={selectedMember.profilePicture} 
                  alt="Selected Member" 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-300 mr-3" />
              )}
              <div>
                <p className="font-medium dark:text-gray-200">Selected: {selectedMember.firstName} {selectedMember.lastName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedMember.aiesecEmail}</p>
                {selectedMember.lastCommentDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last comment: {moment(selectedMember.lastCommentDate).format('MMM D, YYYY [at] h:mm A')}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setSelectedMember(null)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Change Member
            </button>
          </div>
        )}
      </div>
      
      {/* Comment Section (only shown when member is selected) */}
      {selectedMember && (
        <>
          {/* Add Comment Section (only for LCVPs) */}
          {isLCVP && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {currentUser.profilePicture ? (
                    <img 
                      src={currentUser.profilePicture} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Add a comment about ${selectedMember.firstName}...`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      <FaPaperPlane className="mr-2" />
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Comments List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-300">
                {isLCVP ? (
                  `No comments yet for ${selectedMember.firstName}. Be the first to add one!`
                ) : (
                  `No comments available for ${selectedMember.firstName}.`
                )}
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {comment.author.profilePicture ? (
                        <img 
                          src={comment.author.profilePicture} 
                          alt="Author" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-300" />
                      )}
                      <div>
                        <p className="font-medium dark:text-gray-200">{comment.author.firstName} {comment.author.lastName}</p>
                        <p className="font-medium dark:text-gray-200">{comment.author.aiesecEmail}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {moment(comment.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                        </p>
                      </div>
                    </div>
                    {isLCVP && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingContent(comment.content);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="mt-4">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        rows="3"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 border border-gray-300 rounded-lg dark:border-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateComment}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg dark:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pl-13">
                      <p className="whitespace-pre-line dark:text-gray-200">{comment.content}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
      
      {!selectedMember && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-300">
          <FaUserCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
          <p className="mt-2">
            Select a member to {isLCVP ? 'view or add comments' : 'view comments'}
          </p>
          {dateFilter !== 'all' && (
            <p className="mt-1 text-sm">
              Currently showing members with comments from: {dateFilter}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
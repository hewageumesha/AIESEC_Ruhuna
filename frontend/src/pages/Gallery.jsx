import React, { useEffect, useState } from 'react';
import { Spin, Modal, Button } from 'antd';
import { DeleteOutlined, SelectOutlined, EyeOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';

const GalleryPage = ({ currentUserRole = '', userId = '' }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fullViewImage, setFullViewImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categoryOptions = [
    { key: 'all', label: 'All Events' },
    { key: 'SOUTHFEST', label: 'SouthFest' },
    { key: 'YOUTHSPACE', label: 'YouthSpace' },
    { key: 'ODEYSSEY', label: 'Odeyssey' },
    { key: '', label: 'Other' },
  ];

  const canEdit = (currentUserRole === 'LCP' || currentUserRole === 'LCVP') && isLoggedIn;

  useEffect(() => {
    // Check if user is logged in based on userId
    setIsLoggedIn(!!userId);
  }, [userId]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/gallery');
        const data = await res.json();
        setImages(data);
        setFilteredImages(data);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        console.log('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (categoryFilter === 'all') {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(img => img.category === categoryFilter);
      setFilteredImages(filtered);
    }
    setSelectedImages(new Set()); // Clear selections when filter changes
  }, [categoryFilter, images]);

  const handleImageClick = (img) => {
    if (canEdit) {
      // Toggle selection in admin mode
      const newSelected = new Set(selectedImages);
      if (newSelected.has(img.id)) {
        newSelected.delete(img.id);
      } else {
        newSelected.add(img.id);
      }
      setSelectedImages(newSelected);
    } else {
      // Show full view for regular users
      setFullViewImage(img);
    }
  };

  const handleSelectAll = () => {
    if (!canEdit) return;
    
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      const allIds = new Set(filteredImages.map(img => img.id));
      setSelectedImages(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;
    
    setDeleting(true);
    try {
      // Replace with your actual delete API endpoint
      const res = await fetch('http://localhost:8080/api/gallery/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageIds: Array.from(selectedImages),
          userId: userId
        })
      });
      
      if (!res.ok) throw new Error('Delete failed');
      
      // Remove deleted images from state
      const updatedImages = images.filter(img => !selectedImages.has(img.id));
      setImages(updatedImages);
      setSelectedImages(new Set());
      console.log(`${selectedImages.size} images deleted successfully`);
    } catch (error) {
      console.error('Failed to delete images:', error);
      console.log('Failed to delete images');
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
    }
  };

  const handleDownload = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const getCategoryLabel = (categoryKey) => {
    const category = categoryOptions.find(opt => opt.key === categoryKey);
    return category ? category.label : '';
  };

  // Masonry-like layout function
  const createMasonryLayout = (images) => {
    const columns = 4; // Number of columns
    const imageColumns = Array.from({ length: columns }, () => []);
    
    images.forEach((img, index) => {
      const columnIndex = index % columns;
      imageColumns[columnIndex].push(img);
    });
    
    return imageColumns;
  };

  const masonryColumns = createMasonryLayout(filteredImages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-4xl font-bold">AIESEC Sri Lanka</h1>
          </div>
          <p className="text-center text-blue-100 text-lg">Showcasing our memorable moments and achievements</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categoryOptions.map(category => (
              <button
                key={category.key}
                onClick={() => setCategoryFilter(category.key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  categoryFilter === category.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Controls */}
        {canEdit && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <SelectOutlined className="text-blue-600" />
                  <span>Admin Mode: {currentUserRole}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedImages.size} of {filteredImages.length} selected
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="default"
                  icon={<SelectOutlined />}
                  onClick={handleSelectAll}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {selectedImages.size === filteredImages.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setDeleteModalVisible(true)}
                  disabled={selectedImages.size === 0}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete Selected ({selectedImages.size})
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading gallery images...</p>
          </div>
        ) : (
          <>
            {/* Images Grid - Masonry Layout */}
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <EyeOutlined className="text-6xl text-gray-400 mb-4" />
                <h3 className="text-xl text-gray-600 mb-2">No images found</h3>
                <p className="text-gray-500">No images available for the selected category.</p>
              </div>
            ) : (
              <div className="flex gap-1">
                {masonryColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex-1 flex flex-col gap-1">
                    {column.map((img, index) => (
                      <div
                        key={img.id || index}
                        className={`group relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg ${
                          canEdit ? 'cursor-pointer' : 'cursor-zoom-in'
                        } ${
                          selectedImages.has(img.id) 
                            ? 'ring-2 ring-blue-500 ring-opacity-50' 
                            : ''
                        }`}
                        onClick={() => handleImageClick(img)}
                      >
                        {/* Image */}
                        <div className="relative bg-gray-100">
                          <img
                            src={img.imageUrl}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                          
                          {/* Download Button */}
                          {!canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(img.imageUrl, `image_${img.id}.jpg`);
                              }}
                              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                            >
                              <DownloadOutlined className="text-white text-sm" />
                            </button>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {canEdit && selectedImages.has(img.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}

                        {/* Admin Mode Indicator */}
                        {canEdit && !selectedImages.has(img.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Full View Modal */}
      {fullViewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setFullViewImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors z-10"
            >
              <CloseOutlined className="text-white text-lg" />
            </button>
            <button
              onClick={() => handleDownload(fullViewImage.imageUrl, `image_${fullViewImage.id}.jpg`)}
              className="absolute top-4 left-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors z-10"
            >
              <DownloadOutlined className="text-white text-lg" />
            </button>
            <img
              src={fullViewImage.imageUrl}
              alt="Full view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={handleDeleteSelected}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={deleting}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete {selectedImages.size} selected image(s)?</p>
        <p className="text-red-500 text-sm mt-2">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default GalleryPage;
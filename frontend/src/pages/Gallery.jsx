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
    { key: 'PRESTIGE', label: 'Prestige' },
    { key: 'OTHER', label: 'Other' },
  ];

  // Check if user can edit (LCP or LCVP roles only)
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
      // Delete images one by one using the correct API endpoint
      const deletePromises = Array.from(selectedImages).map(async (imageId) => {
        const res = await fetch(`http://localhost:8080/api/gallery/${imageId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error(`Failed to delete image ${imageId}`);
        return imageId;
      });
      
      await Promise.all(deletePromises);
      
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
    return category ? category.label : 'Other';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* AIESEC Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-3 mr-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold">AIESEC in Ruhuna</h1>
          </div>
          <p className="text-center text-blue-100 text-xl">Event Gallery</p>
          <p className="text-center text-blue-200 text-lg mt-2">Showcasing our memorable moments and achievements</p>
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
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  categoryFilter === category.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200 hover:border-blue-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Controls */}
        {canEdit && (
          <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="font-medium">Admin Mode: {currentUserRole}</span>
                </div>
                <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  {selectedImages.size} of {filteredImages.length} selected
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="default"
                  icon={<SelectOutlined />}
                  onClick={handleSelectAll}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                >
                  {selectedImages.size === filteredImages.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setDeleteModalVisible(true)}
                  disabled={selectedImages.size === 0}
                  className="bg-red-500 hover:bg-red-600 border-red-500"
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
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <EyeOutlined className="text-6xl text-gray-400 mb-4" />
                <h3 className="text-2xl text-gray-600 mb-2">No images found</h3>
                <p className="text-gray-500">No images available for the selected category.</p>
              </div>
            ) : (
              <div className="flex gap-2">
                {masonryColumns.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex-1 flex flex-col gap-2">
                    {column.map((img, index) => (
                      <div
                        key={img.id || index}
                        className={`group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
                          canEdit ? 'cursor-pointer' : 'cursor-zoom-in'
                        } ${
                          selectedImages.has(img.id) 
                            ? 'ring-4 ring-blue-500 ring-opacity-50' 
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
                          
                          {/* Category Badge */}
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {getCategoryLabel(img.category)}
                          </div>
                          
                          {/* Download Button */}
                          {!canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(img.imageUrl, `image_${img.id}.jpg`);
                              }}
                              className="absolute top-2 right-2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                            >
                              <DownloadOutlined className="text-white text-lg" />
                            </button>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {canEdit && selectedImages.has(img.id) && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}

                        {/* Admin Mode Indicator */}
                        {canEdit && !selectedImages.has(img.id) && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                            <div className="w-4 h-4 border-2 border-blue-600 rounded-full"></div>
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
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl max-h-full">
            <button
              onClick={() => setFullViewImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors z-10"
            >
              <CloseOutlined className="text-white text-xl" />
            </button>
            <button
              onClick={() => handleDownload(fullViewImage.imageUrl, `image_${fullViewImage.id}.jpg`)}
              className="absolute top-4 left-4 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors z-10"
            >
              <DownloadOutlined className="text-white text-xl" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">{getCategoryLabel(fullViewImage.category)}</span>
            </div>
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
        title={
          <div className="flex items-center gap-2">
            <DeleteOutlined className="text-red-500" />
            <span>Confirm Deletion</span>
          </div>
        }
        open={deleteModalVisible}
        onOk={handleDeleteSelected}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={deleting}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        className="delete-modal"
      >
        <p className="text-gray-700">Are you sure you want to delete {selectedImages.size} selected image(s)?</p>
        <p className="text-red-500 text-sm mt-2 font-medium">⚠️ This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default GalleryPage;

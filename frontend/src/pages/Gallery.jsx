import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Modal, Button, message, notification } from 'antd';
import { DeleteOutlined, SelectOutlined, EyeOutlined, DownloadOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { deleteImageFromStorage } from '../service/deleteImageFromStorage';

const GalleryPage = () => {
  // Get user data from Redux store
  const { currentUser } = useSelector((state) => state.user);
  
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fullViewImage, setFullViewImage] = useState(null);

  const categoryOptions = [
    { key: 'all', label: 'All Events' },
    { key: 'SOUTHFEST', label: 'SouthFest' },
    { key: 'YOUTHSPACE', label: 'YouthSpace' },
    { key: 'ODEYSSEY', label: 'Odeyssey' },
    { key: 'PRESTIGE', label: 'Prestige' },
    { key: 'OTHER', label: 'Other' },
  ];

  // Check if user is logged in and has admin privileges
  const isLoggedIn = !!currentUser;
  const currentUserRole = currentUser?.role || '';
  const userId = currentUser?.id || currentUser?._id || '';
  const authToken = currentUser?.token || '';

  // Check if user can edit (LCP or LCVP roles only)
  const canEdit = (currentUserRole === 'LCP' || currentUserRole === 'LCVP') && isLoggedIn;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Add authorization header if user is logged in
        const headers = {};
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch('http://localhost:8080/api/gallery', {
          headers
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await res.json();
        
        // ✅ FIXED: Map backend fields to frontend fields
        const imagesWithIds = data.map((img, index) => ({
          ...img,
          id: img.galleryId || img.id || `img_${index}_${Date.now()}`, // Use galleryId as id
          imageUrl: img.imageUrl,
          category: img.category,
          storagePath: img.storagePath,
          uploadedAt: img.uploadedAt
        }));
        
        setImages(imagesWithIds);
        setFilteredImages(imagesWithIds);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        message.error('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [authToken]);

  useEffect(() => {
    if (categoryFilter === 'all') {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(img => img.category === categoryFilter);
      setFilteredImages(filtered);
    }
    setSelectedImages(new Set()); // Clear selections when filter changes
  }, [categoryFilter, images]);

  // Fixed handleImageClick function
  const handleImageClick = useCallback((img, event) => {
    // Prevent event bubbling
    if (event) {
      event.stopPropagation();
    }

    if (canEdit) {
      // Toggle selection in admin mode
      setSelectedImages(prevSelected => {
        const newSelected = new Set(prevSelected);
        const imageId = img.id;
        
        if (newSelected.has(imageId)) {
          newSelected.delete(imageId);
          console.log(`Deselected image: ${imageId}`);
        } else {
          newSelected.add(imageId);
          console.log(`Selected image: ${imageId}`);
        }
        
        console.log('Current selection:', Array.from(newSelected));
        return newSelected;
      });
    } else {
      // Show full view for regular users
      setFullViewImage(img);
    }
  }, [canEdit]);

  const handleSelectAll = useCallback(() => {
    if (!canEdit) return;
    
    setSelectedImages(prevSelected => {
      if (prevSelected.size === filteredImages.length) {
        // Deselect all
        return new Set();
      } else {
        // Select all
        const allIds = new Set(filteredImages.map(img => img.id));
        return allIds;
      }
    });
  }, [canEdit, filteredImages]);

  // Extract storage path from imageUrl for Supabase deletion
  const extractStoragePath = (imageUrl) => {
    try {
      // Assuming your Supabase storage URLs follow the pattern:
      // https://project.supabase.co/storage/v1/object/public/gallery/path/to/image.jpg
      const url = new URL(imageUrl);
      const pathSegments = url.pathname.split('/');
      const galleryIndex = pathSegments.findIndex(segment => segment === 'gallery');
      if (galleryIndex !== -1 && galleryIndex < pathSegments.length - 1) {
        return pathSegments.slice(galleryIndex + 1).join('/');
      }
      return null;
    } catch (error) {
      console.error('Error extracting storage path:', error);
      return null;
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) {
      message.warning('No images selected for deletion');
      return;
    }
    
    // Double-check authorization
    if (!canEdit) {
      message.error('You do not have permission to delete images');
      return;
    }

    setDeleting(true);
    const selectedImageIds = Array.from(selectedImages);
    
    console.log('Deleting images with IDs:', selectedImageIds);
    
    try {
      // Get full image objects for storage deletion
      const imagesToDelete = images.filter(img => selectedImages.has(img.id));
      
      console.log('Images to delete:', imagesToDelete.map(img => ({ id: img.id, url: img.imageUrl })));
      
      // ✅ FIXED: Ensure IDs are numbers (galleryId is Long in backend)
      const galleryIds = selectedImageIds.map(id => {
        const numericId = Number(id);
        if (isNaN(numericId)) {
          throw new Error(`Invalid gallery ID: ${id}`);
        }
        return numericId;
      });
      
      console.log('Gallery IDs to send to backend:', galleryIds);
      
      // Use batch delete endpoint with proper error handling
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      // ✅ FIXED: Send array of Long IDs to match backend expectation
      const batchDeleteResponse = await fetch('http://localhost:8080/api/gallery/batch', {
        method: 'DELETE',
        headers,
        body: JSON.stringify(galleryIds) // Send [1, 2, 3] format
      });

      // Log response for debugging
      console.log('Backend response status:', batchDeleteResponse.status);

      if (!batchDeleteResponse.ok) {
        let errorMessage = `Backend deletion failed: ${batchDeleteResponse.status}`;
        try {
          const errorData = await batchDeleteResponse.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `HTTP ${batchDeleteResponse.status}: ${batchDeleteResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      console.log('Backend deletion successful');

      // ✅ FIXED: Delete images from Supabase storage using storagePath if available
      const storageDeletePromises = imagesToDelete.map(async (img) => {
        try {
          // Use storagePath if available, otherwise extract from imageUrl
          const storagePath = img.storagePath || extractStoragePath(img.imageUrl);
          if (storagePath) {
            await deleteImageFromStorage(storagePath);
            console.log(`Deleted from storage: ${storagePath}`);
          } else {
            console.warn(`No storage path found for image: ${img.id}`);
          }
        } catch (storageError) {
          console.error(`Failed to delete image from storage: ${img.id}`, storageError);
          // Continue with other deletions even if one fails
        }
      });

      // Wait for all storage deletions to complete
      await Promise.allSettled(storageDeletePromises);
      
      // Remove deleted images from state
      setImages(prevImages => prevImages.filter(img => !selectedImages.has(img.id)));
      setSelectedImages(new Set());
      
      // Beautiful success notification
      notification.success({
        message: 'Images Deleted Successfully',
        description: `${selectedImageIds.length} image${selectedImageIds.length > 1 ? 's' : ''} ${selectedImageIds.length > 1 ? 'have' : 'has'} been removed from the gallery.`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 4,
        style: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      });
      
    } catch (error) {
      console.error('Failed to delete images:', error);
      message.error(`Failed to delete images: ${error.message}`);
      
      // ✅ FIXED: Refresh the gallery to sync with backend state
      try {
        const headers = {};
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }
        const res = await fetch('http://localhost:8080/api/gallery', { headers });
        if (res.ok) {
          const data = await res.json();
          const imagesWithIds = data.map((img, index) => ({
            ...img,
            id: img.galleryId || img.id || `img_${index}_${Date.now()}`,
            imageUrl: img.imageUrl,
            category: img.category,
            storagePath: img.storagePath,
            uploadedAt: img.uploadedAt
          }));
          setImages(imagesWithIds);
          setFilteredImages(imagesWithIds);
        }
      } catch (refreshError) {
        console.error('Failed to refresh gallery:', refreshError);
      }
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
      message.error('Failed to download image');
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
        {/* Category Filter Tabs and Management Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
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

          {/* Management Controls - Only visible to LCP/LCVP users */}
          {canEdit && (
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-full font-medium">
                  {selectedImages.size} of {filteredImages.length} images selected
                </div>
                <Button
                  type="default"
                  icon={<SelectOutlined />}
                  onClick={handleSelectAll}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-medium"
                >
                  {selectedImages.size === filteredImages.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setDeleteModalVisible(true)}
                  disabled={selectedImages.size === 0}
                  className="bg-red-500 hover:bg-red-600 border-red-500 font-medium"
                >
                  Delete Selected ({selectedImages.size})
                </Button>
              </div>
            </div>
          )}
        </div>

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
                        key={img.id}
                        className={`group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
                          canEdit ? 'cursor-pointer' : 'cursor-zoom-in'
                        } ${
                          selectedImages.has(img.id) 
                            ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl' 
                            : ''
                        }`}
                        onClick={(e) => handleImageClick(img, e)}
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
                          
                          {/* Download Button - Only for non-admin users */}
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

                        {/* Selection Indicator - Only for LCP/LCVP users */}
                        {canEdit && selectedImages.has(img.id) && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}

                        {/* Selection Indicator - Only for LCP/LCVP users */}
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

      {/* Full View Modal - Only for non-admin users */}
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

      {/* Delete Confirmation Modal - Only for LCP/LCVP users */}
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
        <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default GalleryPage;
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Modal, Button, message, notification } from 'antd';
import { DeleteOutlined, SelectOutlined, EyeOutlined, CloseOutlined, CheckCircleOutlined, CaretDownOutlined } from '@ant-design/icons';
import { deleteImageFromStorage } from '../service/deleteImageFromStorage';
import axios from 'axios';
import lgFullscreen from 'lightgallery/plugins/fullscreen';


// Import LightGallery CSS
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-fullscreen.css';

const GalleryPage = () => {
  const lightGalleryRef = useRef(null);
  
  // Get user data from Redux store
  const { currentUser } = useSelector((state) => state.user);
  
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [versions, setVersions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVersion, setSelectedVersion] = useState('all');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Check if user is logged in and has admin privileges
  const isLoggedIn = !!currentUser;
  const currentUserRole = currentUser?.role || '';
  const userId = currentUser?.id || currentUser?._id || '';
  const authToken = currentUser?.token || '';

  // Check if user can edit (LCP or LCVP roles only)
  const canEdit = (currentUserRole === 'LCP' || currentUserRole === 'LCVP') && isLoggedIn;

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load versions when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      loadVersions(selectedCategory);
    } else {
      setVersions([]);
      setSelectedVersion('all');
    }
  }, [selectedCategory]);

  // Filter images when category or version changes
  useEffect(() => {
    filterImages();
  }, [selectedCategory, selectedVersion, images]);

  const loadCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
      fetchImages();
    } catch (error) {
      console.error('Failed to load categories:', error);
      message.error('Failed to load categories');
      fetchImages();
    }
  };

  const loadVersions = async (categoryId) => {
    try {
      setLoadingVersions(true);
      const response = await axios.get(`http://localhost:8080/api/categories/${categoryId}/versions`);
      setVersions(response.data);
      setSelectedVersion('all');
    } catch (error) {
      console.error('Failed to load versions:', error);
      message.error('Failed to load versions');
    } finally {
      setLoadingVersions(false);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
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
      
      const imagesWithIds = data.map((img, index) => ({
        ...img,
        id: img.galleryId || img.id || `img_${index}_${Date.now()}`,
        imageUrl: img.imageUrl,
        categoryName: img.categoryName,
        versionName: img.versionName,
        eventVersionId: img.eventVersionId,
        storagePath: img.storagePath,
        uploadedAt: img.uploadedAt
      }));
      
      setImages(imagesWithIds);
      setFilteredImages(imagesWithIds);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      message.error('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = images;

    if (selectedCategory !== 'all') {
      const categoryName = categories.find(cat => cat.id.toString() === selectedCategory)?.categoryName;
      if (categoryName) {
        filtered = filtered.filter(img => img.categoryName === categoryName);
      }
    }

    if (selectedVersion !== 'all') {
      filtered = filtered.filter(img => img.eventVersionId?.toString() === selectedVersion);
    }

    setFilteredImages(filtered);
    setSelectedImages(new Set());
  };

  const handleImageClick = useCallback((img, event, index) => {
    if (event) {
      event.stopPropagation();
    }

    if (canEdit) {
      setSelectedImages(prevSelected => {
        const newSelected = new Set(prevSelected);
        const imageId = img.id;
        
        if (newSelected.has(imageId)) {
          newSelected.delete(imageId);
        } else {
          newSelected.add(imageId);
        }
        
        return newSelected;
      });
    } else {
      // Open lightbox at specific index
      if (lightGalleryRef.current) {
        lightGalleryRef.current.openGallery(index);
      }
    }
  }, [canEdit]);

  const handleSelectAll = useCallback(() => {
    if (!canEdit) return;
    
    setSelectedImages(prevSelected => {
      if (prevSelected.size === filteredImages.length) {
        return new Set();
      } else {
        const allIds = new Set(filteredImages.map(img => img.id));
        return allIds;
      }
    });
  }, [canEdit, filteredImages]);

  const extractStoragePath = (imageUrl) => {
    try {
      const url = new URL(imageUrl);
      const pathSegments = url.pathname.split('/');
      const galleryIndex = pathSegments.findIndex(segment => segment === 'eventimages');
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
    
    if (!canEdit) {
      message.error('You do not have permission to delete images');
      return;
    }

    setDeleting(true);
    const selectedImageIds = Array.from(selectedImages);
    
    try {
      const imagesToDelete = images.filter(img => selectedImages.has(img.id));
      
      const galleryIds = selectedImageIds.map(id => {
        const numericId = Number(id);
        if (isNaN(numericId)) {
          throw new Error(`Invalid gallery ID: ${id}`);
        }
        return numericId;
      });
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const batchDeleteResponse = await fetch('http://localhost:8080/api/gallery/batch', {
        method: 'DELETE',
        headers,
        body: JSON.stringify(galleryIds)
      });

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

      const storageDeletePromises = imagesToDelete.map(async (img) => {
        try {
          const storagePath = img.storagePath || extractStoragePath(img.imageUrl);
          if (storagePath) {
            await deleteImageFromStorage(storagePath);
          }
        } catch (storageError) {
          console.error(`Failed to delete image from storage: ${img.id}`, storageError);
        }
      });

      await Promise.allSettled(storageDeletePromises);
      
      setImages(prevImages => prevImages.filter(img => !selectedImages.has(img.id)));
      setSelectedImages(new Set());
      
      notification.success({
        message: 'Images Deleted Successfully',
        description: `${selectedImageIds.length} image${selectedImageIds.length > 1 ? 's' : ''} ${selectedImageIds.length > 1 ? 'have' : 'has'} been removed from the gallery.`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 4,
      });
      
    } catch (error) {
      console.error('Failed to delete images:', error);
      message.error(`Failed to delete images: ${error.message}`);
      fetchImages();
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
    }
  };

  const getCategoryLabel = (categoryName) => {
    return categoryName || 'Other';
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedVersion('all');
    setHoveredCategory(null);
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id.toString() === categoryId);
  };

  const handleCategoryHover = async (categoryId) => {
    const category = getCategoryById(categoryId);
    if (category && category.isAnnual) {
      if (selectedCategory !== categoryId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/categories/${categoryId}/versions`);
          setHoveredCategory({ id: categoryId, versions: response.data });
        } catch (error) {
          console.error('Failed to load versions for hover:', error);
          setHoveredCategory({ id: categoryId, versions: [] });
        }
      } else {
        setHoveredCategory({ id: categoryId, versions });
      }
    }
  };

  const createMasonryLayout = (images) => {
    const columns = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    const imageColumns = Array.from({ length: columns }, () => []);
    
    images.forEach((img, index) => {
      const columnIndex = index % columns;
      imageColumns[columnIndex].push(img);
    });
    
    return imageColumns;
  };

  const masonryColumns = createMasonryLayout(filteredImages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <style jsx>{`
        :global(.lg-backdrop) {
          background-color: rgba(0, 0, 0, 0.95) !important;
        }
        :global(.lg-toolbar) {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%) !important;
        }
        :global(.lg-close) {
          color: #ffffff !important;
          background: rgba(3, 126, 243, 0.9) !important;
          border-radius: 50% !important;
          width: 48px !important;
          height: 48px !important;
          font-size: 20px !important;
          transition: all 0.3s ease !important;
        }
        :global(.lg-close:hover) {
          background: rgba(3, 126, 243, 1) !important;
          transform: scale(1.1) !important;
        }
        :global(.lg-next), :global(.lg-prev) {
          color: #ffffff !important;
          background: rgba(3, 126, 243, 0.8) !important;
          border-radius: 50% !important;
          width: 56px !important;
          height: 56px !important;
          font-size: 24px !important;
          transition: all 0.3s ease !important;
        }
        :global(.lg-next:hover), :global(.lg-prev:hover) {
          background: rgba(3, 126, 243, 1) !important;
          transform: scale(1.05) !important;
        }
        :global(.lg-counter) {
          color: #ffffff !important;
          background: rgba(0, 47, 108, 0.8) !important;
          padding: 8px 16px !important;
          border-radius: 20px !important;
          font-weight: 500 !important;
        }
        :global(.lg-sub-html) {
          background: linear-gradient(0deg, rgba(0, 47, 108, 0.9) 0%, transparent 100%) !important;
          color: #ffffff !important;
          padding: 20px !important;
          font-size: 16px !important;
        }
        :global(.lg-thumb-outer) {
          background: rgba(0, 47, 108, 0.95) !important;
        }
        :global(.lg-thumb-item) {
          border: 2px solid transparent !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          transition: all 0.3s ease !important;
        }
        :global(.lg-thumb-item.active), :global(.lg-thumb-item:hover) {
          border-color: #037ef3 !important;
        }
        :global(.lg-fullscreen) {
          color: #ffffff !important;
          background: rgba(3, 126, 243, 0.8) !important;
          border-radius: 50% !important;
          width: 44px !important;
          height: 44px !important;
          transition: all 0.3s ease !important;
        }
        :global(.lg-fullscreen:hover) {
          background: rgba(3, 126, 243, 1) !important;
        }
      `}</style>

    {/* AIESEC Header */}
<div className="
  bg-gradient-to-r from-[#e6f4ff] via-[#b3e0ff] to-[#037ef3] 
  dark:from-[#004080] dark:via-[#0059b3] dark:to-[#002f6c]
  text-center text-gray-900 dark:text-white
  py-16 px-4 shadow-xl transition-colors duration-500
">
  <div className="max-w-7xl mx-auto">
    <h1 className="
      text-5xl md:text-6xl font-extrabold mb-4
      bg-gradient-to-r from-[#037ef3] via-[#0066cc] to-[#002f6c]
      bg-clip-text text-transparent
    ">
      AIESEC in Ruhuna
    </h1>
    <p className="text-xl md:text-2xl text-[#0066cc] dark:text-blue-200 mb-2">
      Event Gallery
    </p>
    <p className="text-lg text-[#037ef3]/80 dark:text-blue-300 max-w-2xl mx-auto">
      Showcasing our memorable moments and achievements
    </p>
  </div>
</div>


      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Category Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#037ef3] to-[#0066cc] text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-[#037ef3] dark:hover:border-[#037ef3] shadow-sm hover:shadow-md'
              }`}
            >
              All Events
            </button>

            {categories.map(category => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleCategoryHover(category.id.toString())}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => handleCategorySelect(category.id.toString())}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 ${
                    selectedCategory === category.id.toString()
                      ? 'bg-gradient-to-r from-[#002f6c] to-[#037ef3] text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-[#037ef3] dark:hover:border-[#037ef3] shadow-sm hover:shadow-md'
                  }`}
                >
                  {category.categoryName}
                  {category.isAnnual && (
                    <CaretDownOutlined className={`text-xs transition-transform duration-200 ${
                      hoveredCategory?.id === category.id.toString() ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>

                {category.isAnnual && hoveredCategory?.id === category.id.toString() && hoveredCategory.versions && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 py-2 min-w-[200px] z-10 animate-fade-in">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      Select Version
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category.id.toString());
                        setHoveredCategory(null);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-sm transition-colors ${
                        selectedCategory === category.id.toString() && selectedVersion === 'all'
                          ? 'bg-blue-50 dark:bg-gray-700 text-[#037ef3] dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-200 hover:text-[#037ef3] dark:hover:text-blue-400'
                      }`}
                    >
                      All Versions
                    </button>
                    {hoveredCategory.versions.map(version => (
                      <button
                        key={version.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategorySelect(category.id.toString());
                          setSelectedVersion(version.id.toString());
                          setHoveredCategory(null);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-sm transition-colors ${
                          selectedVersion === version.id.toString()
                            ? 'bg-blue-50 dark:bg-gray-700 text-[#037ef3] dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-200 hover:text-[#037ef3] dark:hover:text-blue-400'
                        }`}
                      >
                        {version.versionName}
                        {version.eventDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({new Date(version.eventDate).getFullYear()})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

       
          {/* Management Controls - Only visible to LCP/LCVP users */}
          {canEdit && (
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-full font-medium">
                  {selectedImages.size} of {filteredImages.length} images selected
                </div>
                <Button
                  type="default"
                  icon={<SelectOutlined />}
                  onClick={handleSelectAll}
                  className="border-[#037ef3] text-[#037ef3] hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-[#0066cc] font-medium"
                  style={{ borderColor: '#037ef3', color: '#037ef3' }}
                >
                  {selectedImages.size === filteredImages.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setDeleteModalVisible(true)}
                  disabled={selectedImages.size === 0}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium border-0"
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
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading gallery images...</p>
          </div>
        ) : (
          <>
            {/* Images Grid - Masonry Layout with LightGallery */}
            {filteredImages.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <EyeOutlined className="text-6xl text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-2xl text-gray-600 dark:text-gray-300 mb-2">No images found</h3>
                <p className="text-gray-500 dark:text-gray-400">No images available for the selected filters.</p>
              </div>
            ) : (
              <LightGallery
                onInit={(instance) => {
                  lightGalleryRef.current = instance;
                }}
                speed={500}
                plugins={[lgThumbnail, lgZoom, lgFullscreen]}
                mode="lg-fade"
                thumbnail={true}
                download={false}
                counter={true}
                closable={true}
                mousewheel={true}
                getCaptionFromTitleOrAlt={false}
                subHtmlSelectorRelative={true}
                selector=".gallery-item"
                addClass="custom-lg"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((img, index) => (
                    <div
                      key={img.id}
                      className={`gallery-item group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] dark:shadow-gray-700 dark:hover:shadow-gray-600 ${
                        canEdit ? 'cursor-pointer' : 'cursor-zoom-in'
                      } ${
                        selectedImages.has(img.id) 
                          ? 'ring-4 ring-[#037ef3] ring-opacity-50 shadow-2xl' 
                          : ''
                      }`}
                      data-src={img.imageUrl}
                      data-sub-html={`
                        <div class="text-center">
                          <h4 class="text-lg font-semibold mb-2">${getCategoryLabel(img.categoryName)}</h4>
                          ${img.versionName ? `<p class="text-sm opacity-90">${img.versionName}</p>` : ''}
                        </div>
                      `}
                      onClick={(e) => handleImageClick(img, e, index)}
                    >
                      <div className="relative bg-gray-100 dark:bg-gray-700 aspect-square">
                        <img
                          src={img.imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        
                        {/* Category and Version Badge */}
                        <div className="absolute top-2 left-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-gradient-to-r from-[#037ef3] to-[#0066cc] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                            {getCategoryLabel(img.categoryName)}
                          </div>
                          {img.versionName && (
                            <div className="bg-gradient-to-r from-[#002f6c] to-[#037ef3] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                              {img.versionName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selection Indicator - Only for LCP/LCVP users */}
                      {canEdit && selectedImages.has(img.id) && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-[#037ef3] rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      {canEdit && !selectedImages.has(img.id) && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                          <div className="w-4 h-4 border-2 border-[#037ef3] rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </LightGallery>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal - Only for LCP/LCVP users */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <DeleteOutlined className="text-red-500" />
            <span className="dark:text-gray-200">Confirm Deletion</span>
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
        <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete {selectedImages.size} selected image(s)?</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default GalleryPage;

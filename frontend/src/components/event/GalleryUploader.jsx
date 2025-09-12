import React, { useState, useEffect } from 'react';
import { supabase } from '../../service/supabaseClient';
// Using fetch instead of axios for better compatibility
import { message, Select, Upload, Button, Modal, Input, DatePicker, Card } from 'antd';
import { UploadOutlined, CheckCircleTwoTone, PlusOutlined, CloudUploadOutlined, FolderOpenOutlined, CalendarOutlined, TagOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

// Category Section Component
const CategorySection = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  loadingCategories, 
  setShowNewCategoryModal, 
  getSelectedCategoryObject, 
  isOneTimeEvent 
}) => {
  return (
    <Card 
      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      title={
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FolderOpenOutlined className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Event Category <span className="text-red-500">*</span>
            </span>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Choose the event category for your images
            </div>
          </div>
        </div>
      }
      headStyle={{ 
        backgroundColor: 'transparent', 
        borderBottom: '1px solid rgb(229 231 235)',
        padding: '16px 24px'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <Select
            placeholder="Choose a category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            loading={loadingCategories}
            className="flex-1"
            size="large"
            showSearch
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {categories.map(category => (
              <Option key={category.id} value={category.id.toString()}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.categoryName}</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                    category.isAnnual 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {category.isAnnual ? 'Annual' : 'One-time'}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
          
          <Button 
            icon={<PlusOutlined />} 
            onClick={() => setShowNewCategoryModal(true)}
            size="large"
            type="dashed"
            className="shrink-0 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
          >
            New Category
          </Button>
        </div>
        
        {/* Event Type Info */}
        {selectedCategory && (
          <div className={`p-4 rounded-lg border-l-4 ${
            isOneTimeEvent() 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' 
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
          }`}>
            <div className="flex items-center space-x-2">
              <TagOutlined className={isOneTimeEvent() ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} />
              <span className={`font-semibold ${
                isOneTimeEvent() 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {isOneTimeEvent() ? 'One-time Event' : 'Annual Event'}
              </span>
            </div>
            <p className={`mt-2 text-sm ${
              isOneTimeEvent() 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {isOneTimeEvent() 
                ? 'Images will be uploaded directly to this category.' 
                : 'Please select a version below for this annual event.'
              }
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Version Section Component
const VersionSection = ({ 
  selectedCategory, 
  isOneTimeEvent, 
  versions, 
  selectedVersion, 
  setSelectedVersion, 
  loadingVersions, 
  setShowNewVersionModal, 
  categories 
}) => {
  if (!selectedCategory || isOneTimeEvent()) return null;

  return (
    <Card 
      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      title={
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <CalendarOutlined className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Event Version <span className="text-red-500">*</span>
            </span>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Select the specific version of this annual event
            </div>
          </div>
        </div>
      }
      headStyle={{ 
        backgroundColor: 'transparent', 
        borderBottom: '1px solid rgb(229 231 235)',
        padding: '16px 24px'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <Select
            placeholder="Choose a version"
            value={selectedVersion}
            onChange={setSelectedVersion}
            loading={loadingVersions}
            className="flex-1"
            size="large"
            showSearch
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {versions.map(version => (
              <Option key={version.id} value={version.id.toString()}>
                <div>
                  <div className="font-medium">{version.versionName}</div>
                  {version.eventDate && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {dayjs(version.eventDate).format('YYYY-MM-DD')}
                    </div>
                  )}
                </div>
              </Option>
            ))}
          </Select>
          
          <Button 
            icon={<PlusOutlined />} 
            onClick={() => setShowNewVersionModal(true)}
            size="large"
            type="dashed"
            className="shrink-0 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-300"
          >
            New Version
          </Button>
        </div>
        
        {selectedVersion && versions.length > 0 && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="text-purple-900 dark:text-purple-200">
              <span className="font-semibold">Selected:</span>{' '}
              {versions.find(v => v.id.toString() === selectedVersion)?.versionName}
            </div>
            {versions.find(v => v.id.toString() === selectedVersion)?.description && (
              <div className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                {versions.find(v => v.id.toString() === selectedVersion)?.description}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Upload Section Component
const UploadSection = ({ 
  uploadProps, 
  fileList, 
  selectedCategory, 
  getSelectedCategoryObject, 
  isOneTimeEvent, 
  selectedVersion, 
  versions 
}) => {
  return (
    <Card 
      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      title={
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <UploadOutlined className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upload Images <span className="text-red-500">*</span>
            </span>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Select multiple images to upload (JPG, PNG, etc.)
            </div>
          </div>
        </div>
      }
      headStyle={{ 
        backgroundColor: 'transparent', 
        borderBottom: '1px solid rgb(229 231 235)',
        padding: '16px 24px'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
          <Upload {...uploadProps} listType="picture" className="w-full">
            <div className="text-center">
              <CloudUploadOutlined className="text-4xl text-gray-400 dark:text-gray-500 mb-4" />
              <Button 
                size="large" 
                type="primary"
                className="mb-2 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
              >
                Select Images
              </Button>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                or drag and drop your files here
              </p>
            </div>
          </Upload>
        </div>
        
        {fileList.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">
                {fileList.length} image{fileList.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            {selectedCategory && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Destination:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {getSelectedCategoryObject()?.categoryName}
                </span>
                {!isOneTimeEvent() && selectedVersion && (
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    {' → '}{versions.find(v => v.id.toString() === selectedVersion)?.versionName}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const GalleryUploader = () => {
  const [categories, setCategories] = useState([]);
  const [versions, setVersions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(false);
  
  // New category/version creation states
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIsAnnual, setNewCategoryIsAnnual] = useState(true);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDate, setNewVersionDate] = useState(null);
  const [newVersionDescription, setNewVersionDescription] = useState('');

  // Helper to get selected category object
  const getSelectedCategoryObject = () => {
    return categories.find(c => c.id.toString() === selectedCategory);
  };

  // Check if selected category is one-time (non-annual)
  const isOneTimeEvent = () => {
    const categoryObj = getSelectedCategoryObject();
    return categoryObj && !categoryObj.isAnnual;
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load versions when category changes (only for annual events)
  useEffect(() => {
    if (selectedCategory) {
      const categoryObj = getSelectedCategoryObject();
      if (categoryObj && categoryObj.isAnnual) {
        loadVersions(selectedCategory);
      } else {
        // For one-time events, clear versions and version selection
        setVersions([]);
        setSelectedVersion('');
      }
    } else {
      setVersions([]);
      setSelectedVersion('');
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      // Load all categories (not just those with gallery images)
      const response = await fetch('http://localhost:8080/api/categories');
      if (!response.ok) throw new Error('Failed to load categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      message.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadVersions = async (categoryId) => {
    try {
      setLoadingVersions(true);
      // Load all versions for the category (not just those with gallery images)
      const response = await fetch(`http://localhost:8080/api/categories/${categoryId}/versions`);
      if (!response.ok) throw new Error('Failed to load versions');
      const data = await response.json();
      setVersions(data);
    } catch (error) {
      console.error('Failed to load versions:', error);
      message.error('Failed to load versions');
    } finally {
      setLoadingVersions(false);
    }
  };

  const createNewCategory = async () => {
    if (!newCategoryName.trim()) {
      message.warning('Please enter category name');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: newCategoryName.toUpperCase(),
          isAnnual: newCategoryIsAnnual
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }
      
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      
      // Reset form
      setNewCategoryName('');
      setNewCategoryIsAnnual(true);
      setShowNewCategoryModal(false);
      
      // Auto-select the newly created category
      setSelectedCategory(newCategory.id.toString());
      
      message.success('Category created successfully');
    } catch (error) {
      console.error('Failed to create category:', error);
      message.error(error.message || 'Failed to create category');
    }
  };

  const createNewVersion = async () => {
    if (!selectedCategory || !newVersionName.trim()) {
      message.warning('Please select category and enter version name');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: parseInt(selectedCategory),
          versionName: newVersionName,
          eventDate: newVersionDate ? newVersionDate.toISOString() : null,
          description: newVersionDescription || null
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create version');
      }
      
      const newVersion = await response.json();
      setVersions([...versions, newVersion]);
      
      // Reset form
      setNewVersionName('');
      setNewVersionDate(null);
      setNewVersionDescription('');
      setShowNewVersionModal(false);
      
      // Auto-select the newly created version
      setSelectedVersion(newVersion.id.toString());
      
      message.success('Version created successfully');
    } catch (error) {
      console.error('Failed to create version:', error);
      message.error(error.message || 'Failed to create version');
    }
  };

  const handleUpload = async () => {
    if (!selectedCategory) {
      message.warning('Please select a category');
      return;
    }
    
    // For annual events, version is required
    if (!isOneTimeEvent() && !selectedVersion) {
      message.warning('Please select a version for this annual event');
      return;
    }
    
    if (fileList.length === 0) {
      message.warning('Please select at least one image');
      return;
    }

    setUploading(true);
    let uploadedCount = 0;
    let failedCount = 0;

    try {
      for (const file of fileList) {
        try {
          const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`;
          
          // Upload to Supabase storage
          const { data, error } = await supabase.storage
            .from('eventimages')
            .upload(filename, file.originFileObj);

          if (error) throw error;

          // Get public URL
          const imageUrl = `https://brxpilwosdsnlvmorixi.supabase.co/storage/v1/object/public/eventimages/${filename}`;

          // Prepare payload based on event type
          const payload = {
            imageUrl,
            storagePath: filename
          };

          if (isOneTimeEvent()) {
            // For one-time events, upload directly to category
            payload.categoryId = parseInt(selectedCategory);
          } else {
            // For annual events, upload to version
            payload.eventVersionId = parseInt(selectedVersion);
          }

          // Upload metadata to backend
          const galleryResponse = await fetch('http://localhost:8080/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });

          if (!galleryResponse.ok) {
            throw new Error('Failed to save image metadata');
          }

          uploadedCount++;
        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          failedCount++;
        }
      }

      if (uploadedCount > 0) {
        setSuccessModalVisible(true);
      }
      
      if (failedCount > 0) {
        message.warning(`${uploadedCount} images uploaded successfully, ${failedCount} failed`);
      }

    } catch (err) {
      console.error('Upload process failed:', err);
      message.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    multiple: true,
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
    beforeUpload: () => false, // Prevent automatic upload
    accept: 'image/*',
  };

  const handleSuccessModalOk = () => {
    setSuccessModalVisible(false);
    setFileList([]);
    // Don't reset category and version selections to allow batch uploads
  };

  const resetForm = () => {
    setFileList([]);
    setSelectedCategory('');
    setSelectedVersion('');
  };

  // Check if upload is ready
  const isUploadReady = () => {
    if (!selectedCategory || fileList.length === 0) return false;
    // For annual events, version is required
    if (!isOneTimeEvent() && !selectedVersion) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-t-2xl px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <CloudUploadOutlined className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Event Gallery Uploader</h1>
              <p className="text-blue-100 dark:text-blue-200 mt-1 text-lg">
                Organize and upload your event images with ease
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-b-2xl shadow-lg p-8">
          <div className="space-y-8">
            
            {/* Category Section */}
            <CategorySection 
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              loadingCategories={loadingCategories}
              setShowNewCategoryModal={setShowNewCategoryModal}
              getSelectedCategoryObject={getSelectedCategoryObject}
              isOneTimeEvent={isOneTimeEvent}
            />

            {/* Version Section */}
            <VersionSection 
              selectedCategory={selectedCategory}
              isOneTimeEvent={isOneTimeEvent}
              versions={versions}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
              loadingVersions={loadingVersions}
              setShowNewVersionModal={setShowNewVersionModal}
              categories={categories}
            />

            {/* Upload Section */}
            <UploadSection 
              uploadProps={uploadProps}
              fileList={fileList}
              selectedCategory={selectedCategory}
              getSelectedCategoryObject={getSelectedCategoryObject}
              isOneTimeEvent={isOneTimeEvent}
              selectedVersion={selectedVersion}
              versions={versions}
            />

            {/* Action Buttons */}
            <Card 
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              bodyStyle={{ padding: '24px' }}
            >
              <div className="flex gap-4">
                <Button
                  type="primary"
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={!isUploadReady()}
                  size="large"
                  className="flex-1 h-14 font-semibold text-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 border-blue-600 dark:border-blue-700 text-white"
                  icon={!uploading && <CloudUploadOutlined />}
                >
                  {uploading 
                    ? 'Uploading Images...' 
                    : `Upload ${fileList.length || 0} Image${fileList.length !== 1 ? 's' : ''}`
                  }
                </Button>
                
                <Button
                  onClick={resetForm}
                  disabled={uploading}
                  size="large"
                  className="h-14 px-8 font-semibold bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-600 dark:border-gray-700 text-white hover:text-white dark:text-gray-200 dark:hover:text-white"
                  icon={<EditOutlined />}
                >
                  Reset Form
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* New Category Modal */}
      <Modal
        title={
          <span className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
            Create New Event Category
          </span>
        }
        open={showNewCategoryModal}
        onOk={createNewCategory}
        onCancel={() => {
          setShowNewCategoryModal(false);
          setNewCategoryName('');
          setNewCategoryIsAnnual(true);
        }}
        okText="Create Category"
        confirmLoading={loadingCategories}
        width={600}
        className="dark-modal"
      >
        <div className="space-y-6 py-4">
          <div>
            <label className="block mb-3 font-semibold text-gray-900 dark:text-gray-100">
              Category Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., SOUTHFEST, YOUTHSPACE, LEADERSHIP_SUMMIT"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onPressEnter={createNewCategory}
              size="large"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Use uppercase and underscores for multi-word names
            </p>
          </div>
          
          <div>
            <label className="block mb-3 font-semibold text-gray-900 dark:text-gray-100">Event Type</label>
            <Select
              value={newCategoryIsAnnual}
              onChange={setNewCategoryIsAnnual}
              size="large"
              className="w-full"
            >
              <Option value={true}>
                <div>
                  <div className="font-medium">Annual Event</div>
                  <div className="text-xs text-gray-500">Repeats yearly with versions</div>
                </div>
              </Option>
              <Option value={false}>
                <div>
                  <div className="font-medium">One-time Event</div>
                  <div className="text-xs text-gray-500">Single occurrence, no versions needed</div>
                </div>
              </Option>
            </Select>
          </div>
        </div>
      </Modal>

      {/* New Version Modal */}
      <Modal
        title={
          <span className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
            Create New Version for {categories.find(c => c.id.toString() === selectedCategory)?.categoryName || 'Event'}
          </span>
        }
        open={showNewVersionModal}
        onOk={createNewVersion}
        onCancel={() => {
          setShowNewVersionModal(false);
          setNewVersionName('');
          setNewVersionDate(null);
          setNewVersionDescription('');
        }}
        okText="Create Version"
        confirmLoading={loadingVersions}
        width={700}
        className="dark-modal"
      >
        <div className="space-y-6 py-4">
          <div>
            <label className="block mb-3 font-semibold text-gray-900 dark:text-gray-100">
              Version Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., 1.0, 2.0, 2024, Spring Edition"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              size="large"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Use version numbers (1.0, 2.0) or descriptive names (2024, Spring Edition)
            </p>
          </div>
          
          <div>
            <label className="block mb-3 font-semibold text-gray-900 dark:text-gray-100">
              Event Date <span className="text-gray-500">(Optional)</span>
            </label>
            <DatePicker
              value={newVersionDate}
              onChange={setNewVersionDate}
              size="large"
              className="w-full"
              placeholder="Select event date"
              format="YYYY-MM-DD"
            />
          </div>
          
          <div>
            <label className="block mb-3 font-semibold text-gray-900 dark:text-gray-100">
              Description <span className="text-gray-500">(Optional)</span>
            </label>
            <Input.TextArea
              placeholder="Describe this version of the event..."
              value={newVersionDescription}
              onChange={(e) => setNewVersionDescription(e.target.value)}
              rows={4}
              maxLength={500}
              showCount
            />
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successModalVisible}
        onOk={handleSuccessModalOk}
        onCancel={handleSuccessModalOk}
        footer={null}
        centered
        width={500}
        className="success-modal"
      >
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleTwoTone twoToneColor="#10b981" style={{ fontSize: 40 }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Upload Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your images have been successfully uploaded
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Uploaded to: </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {categories.find(c => c.id.toString() === selectedCategory)?.categoryName}
              </span>
              {!isOneTimeEvent() && selectedVersion && (
                <>
                  <span className="text-gray-600 dark:text-gray-400"> → </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {versions.find(v => v.id.toString() === selectedVersion)?.versionName}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="primary" 
              onClick={handleSuccessModalOk}
              size="large"
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 border-blue-600 dark:border-blue-700 text-white"
            >
              Upload More Images
            </Button>
            <Button 
              onClick={() => {
                handleSuccessModalOk();
                resetForm();
              }}
              size="large"
              className="flex-1 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-600 dark:border-gray-700 text-white hover:text-white dark:text-gray-200 dark:hover:text-white"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Custom Styles for Dark Theme */}
      <style jsx global>{`
        /* Dark theme styles for modals */
        .dark .ant-modal-content {
          background-color: rgb(31 41 55) !important;
          border: 1px solid rgb(75 85 99) !important;
        }
        
        .dark .ant-modal-header {
          background-color: rgb(31 41 55) !important;
          border-bottom: 1px solid rgb(75 85 99) !important;
        }
        
        .dark .ant-modal-title {
          color: rgb(243 244 246) !important;
        }
        
        .dark .ant-modal-close-x {
          color: rgb(156 163 175) !important;
        }
        
        .dark .ant-modal-close-x:hover {
          color: rgb(243 244 246) !important;
        }
        
        /* Dark theme for Select components */
        .dark .ant-select-selector {
          background-color: rgb(55 65 81) !important;
          border-color: rgb(75 85 99) !important;
          color: rgb(243 244 246) !important;
        }
        
        .dark .ant-select-selector:hover {
          border-color: rgb(107 114 128) !important;
        }
        
        .dark .ant-select-focused .ant-select-selector {
          border-color: rgb(59 130 246) !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .dark .ant-select-selection-placeholder {
          color: rgb(156 163 175) !important;
        }
        
        .dark .ant-select-dropdown {
          background-color: rgb(31 41 55) !important;
          border: 1px solid rgb(75 85 99) !important;
        }
        
        .dark .ant-select-item {
          color: rgb(243 244 246) !important;
        }
        
        .dark .ant-select-item:hover {
          background-color: rgb(55 65 81) !important;
        }
        
        .dark .ant-select-item-option-selected {
          background-color: rgb(37 99 235) !important;
          color: white !important;
        }
        
        /* Dark theme for Input components */
        .dark .ant-input {
          background-color: rgb(55 65 81) !important;
          border-color: rgb(75 85 99) !important;
          color: rgb(243 244 246) !important;
        }
        
        .dark .ant-input:hover {
          border-color: rgb(107 114 128) !important;
        }
        
        .dark .ant-input:focus {
          border-color: rgb(59 130 246) !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .dark .ant-input::placeholder {
          color: rgb(156 163 175) !important;
        }
        
        /* Dark theme for TextArea */
        .dark .ant-input {
          background-color: rgb(55 65 81) !important;
          border-color: rgb(75 85 99) !important;
          color: rgb(243 244 246) !important;
        }
        
        /* Dark theme for DatePicker */
        .dark .ant-picker {
          background-color: rgb(55 65 81) !important;
          border-color: rgb(75 85 99) !important;
          color: rgb(243 244 246) !important;
        }
        
        .dark .ant-picker:hover {
          border-color: rgb(107 114 128) !important;
        }
        
        .dark .ant-picker-focused {
          border-color: rgb(59 130 246) !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .dark .ant-picker-input > input {
          color: rgb(243 244 246) !important;
        }
        
        .dark .ant-picker-input > input::placeholder {
          color: rgb(156 163 175) !important;
        }
        
        /* Dark theme for Upload components */
        .dark .ant-upload-list-item {
          background-color: rgb(55 65 81) !important;
          border-color: rgb(75 85 99) !important;
        }
        
        .dark .ant-upload-list-item-name {
          color: rgb(243 244 246) !important;
        }
        
        /* Dark theme for Card components */
        .dark .ant-card {
          background-color: rgb(31 41 55) !important;
          border-color: rgb(75 85 99) !important;
        }
        
        .dark .ant-card-head {
          background-color: rgb(31 41 55) !important;
          border-bottom: 1px solid rgb(75 85 99) !important;
        }
        
        .dark .ant-card-head-title {
          color: rgb(243 244 246) !important;
        }
        
        /* Custom button colors for better visibility in dark mode */
        .dark .ant-btn-primary {
          background-color: rgb(37 99 235) !important;
          border-color: rgb(37 99 235) !important;
          color: white !important;
        }
        
        .dark .ant-btn-primary:hover {
          background-color: rgb(29 78 216) !important;
          border-color: rgb(29 78 216) !important;
          color: white !important;
        }
        
        .dark .ant-btn-default {
          background-color: rgb(75 85 99) !important;
          border-color: rgb(75 85 99) !important;
          color: rgb(243 244 246) !important;
        }
        
        .dark .ant-btn-default:hover {
          background-color: rgb(107 114 128) !important;
          border-color: rgb(107 114 128) !important;
          color: white !important;
        }
        
        .dark .ant-btn-dashed {
          border-color: rgb(75 85 99) !important;
          color: rgb(156 163 175) !important;
        }
        
        .dark .ant-btn-dashed:hover {
          border-color: rgb(107 114 128) !important;
          color: rgb(243 244 246) !important;
        }
      `}</style>
    </div>
  );
};

export default GalleryUploader;
import React, { useState } from 'react';
import { supabase } from '../../service/supabaseClient';
import axios from 'axios';
import { message, Select, Upload, Button, Modal } from 'antd';
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons';

const { Option } = Select;

const GalleryUploader = () => {
  const [category, setCategory] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleUpload = async () => {
    if (!category) return message.warning('Please select a category');
    if (fileList.length === 0) return message.warning('Please select at least one image');

    setUploading(true);

    try {
      for (const file of fileList) {
        const filename = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('eventimages')
          .upload(filename, file.originFileObj);

        if (error) throw error;

        const imageUrl = `https://brxpilwosdsnlvmorixi.supabase.co/storage/v1/object/public/eventimages/${filename}`;

        await axios.post('http://localhost:8080/api/gallery', {
          category,
          imageUrl,
        });
      }

      // Show beautiful modal instead of simple message
      setSuccessModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    multiple: true,
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
    beforeUpload: () => false, // prevent auto upload
  };

  const handleSuccessModalOk = () => {
    setSuccessModalVisible(false);
    setFileList([]);
    setCategory('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Select Category:</label>
        <Select
          placeholder="Choose a category"
          value={category}
          onChange={setCategory}
          className="w-full"
        >
          <Option value="SOUTHFEST">Southfest</Option>
          <Option value="YOUTHSPACE">Youthspace</Option>
          <Option value="ODEYSSEY">Odessy</Option>
          <Option value="PRESTIGE">Prestige</Option>
          <Option value="OTHER">Other</Option>
        </Select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Upload Images:</label>
        <Upload {...uploadProps} listType="picture">
          <Button icon={<UploadOutlined />}>Select Images</Button>
        </Upload>
      </div>

      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Upload to Gallery
      </Button>

      {/* Enhanced Success Modal */}
      <Modal
        open={successModalVisible}
        onOk={handleSuccessModalOk}
        onCancel={handleSuccessModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleSuccessModalOk}>
            OK
          </Button>
        ]}
        centered
      >
        <div className="text-center">
          <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
          <h2 className="mt-3 text-xl font-semibold">Upload Complete</h2>
          <p className="text-gray-600 mt-1">All images were uploaded successfully!</p>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryUploader;

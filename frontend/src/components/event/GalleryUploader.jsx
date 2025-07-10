import React, { useState } from 'react';
import { supabase } from '../../service/supabaseClient';
import axios from 'axios';
import { message, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const GalleryUploader = () => {
  const [category, setCategory] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

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

        // New: send category + imageUrl only (no eventId)
        await axios.post('http://localhost:8080/api/gallery', {
          category,
          imageUrl,
        });
      }

      message.success('All images uploaded successfully!');
      setFileList([]);
      setCategory('');
    } catch (err) {
      console.error(err);
      message.error('Upload failed');
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
          <Option value="Leadership Development">Southfest</Option>
          <Option value="Workshops">Youthspace</Option>
          <Option value="Team Building">Odessy</Option>
          <Option value="General Events">Prestige</Option>
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
    </div>
  );
};

export default GalleryUploader;

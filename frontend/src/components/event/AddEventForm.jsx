import React, { useState } from 'react';
import {
  Form, Input, DatePicker, TimePicker, Button, Upload, Radio, message, Select, notification,
  Card, Divider, Space, Typography, InputNumber, Tooltip, Progress, Alert
} from 'antd';
import { 
  InboxOutlined, 
  CheckCircleOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;
const { Title, Text } = Typography;

const AddEventForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventType, setEventType] = useState('in_person');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [hasMerchandise, setHasMerchandise] = useState(false);
  const [selectedMerchTypes, setSelectedMerchTypes] = useState([]);
  const [merchandiseData, setMerchandiseData] = useState({});
  const [formProgress, setFormProgress] = useState(0);

  // Calculate form completion progress
  const calculateProgress = () => {
    const values = form.getFieldsValue();
    const requiredFields = ['eventName', 'description', 'startDate', 'endDate', 'startTime', 'endTime', 'location', 'visibility'];
    const completedFields = requiredFields.filter(field => values[field]).length;
    const imageCompleted = eventImageUrl ? 1 : 0;
    const totalFields = requiredFields.length + 1; // +1 for image
    const progress = Math.round(((completedFields + imageCompleted) / totalFields) * 100);
    setFormProgress(progress);
  };

  React.useEffect(() => {
    calculateProgress();
  }, [eventImageUrl]);

  const showSuccessNotification = (eventName, isPublic) => {
    notification.success({
      message: 'Event Created Successfully! ',
      description: (
        <div>
          <p><strong>{eventName}</strong> has been created and is now {isPublic ? 'publicly available' : 'private to AIESEC members'}.</p>
          <p>Your event is ready to receive registrations!</p>
        </div>
      ),
      placement: 'topRight',
      duration: 4,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      style: {
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    });
  };

  const uploadFile = async (file) => {
    try {
      // Simulate file upload - replace with your actual Supabase upload logic
      const fileName = `${Date.now()}_${file.name}`;
      // Your existing Supabase upload logic here
      const mockUrl = `https://via.placeholder.com/400x200?text=${encodeURIComponent(file.name)}`;
      return mockUrl;
    } catch (err) {
      message.error('Upload failed');
      console.error('Upload exception:', err);
      return '';
    }
  };

  const handleEventImageUpload = async (file) => {
    const url = await uploadFile(file);
    if (url) {
      setEventImageUrl(url);
      calculateProgress();
    }
    return false;
  };

  const handleMerchImagesUpload = async (type, { file, onSuccess, onError }) => {
    try {
      if (file.status === 'removed') return;

      const url = await uploadFile(file);
      if (url) {
        setMerchandiseData((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            images: [...(prev[type]?.images || []), { url, uid: file.uid }],
          },
        }));
        onSuccess && onSuccess();
      } else {
        onError && onError(new Error('Upload failed'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError && onError(error);
    }
  };

  const disabledDate = (current) => current && current < moment().startOf('day');

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);

      // Validation logic
      if (moment(values.endDate).isBefore(values.startDate, 'day')) {
        message.error('End date must be same or after start date.');
        setIsSubmitting(false);
        return;
      }

      if (
        moment(values.startDate).isSame(values.endDate, 'day') &&
        moment(values.endTime).isBefore(values.startTime)
      ) {
        message.error('End time must be after start time.');
        setIsSubmitting(false);
        return;
      }

      // Validate registration close days
      if (values.registrationCloseBeforeDays && values.registrationCloseBeforeDays < 0) {
        message.error('Registration close days must be 0 or positive.');
        setIsSubmitting(false);
        return;
      }

      if (hasMerchandise && selectedMerchTypes.length > 0) {
        const invalidItems = selectedMerchTypes.filter((type) => {
          const data = merchandiseData[type];
          return !data || !data.description?.trim() || !data.images || data.images.length === 0;
        });

        if (invalidItems.length > 0) {
          message.error(`Please complete all selected merchandise items: ${invalidItems.join(', ')}`);
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        eventName: values.eventName,
        description: values.description,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        eventTime: values.startTime.format('hh:mm A'),
        endTime: values.endTime.format('hh:mm A'),
        imageUrl: eventImageUrl,
        isPublic: values.visibility === 'public',
        isVirtual: eventType === 'virtual',
        location: eventType === 'virtual' ? '' : values.location,
        virtualLink: eventType === 'virtual' ? values.location : '',
        registrationCloseBeforeDays: values.registrationCloseBeforeDays || 0,
        hasMerchandise, 
        merchandise: selectedMerchTypes.map((type) => ({
          type,
          description: merchandiseData[type]?.description || '',
          images: merchandiseData[type]?.images?.map((img) => img.url) || [],
          available: true,
        })),
      };

      // Simulate API call
      console.log('Event payload:', payload);
      
      showSuccessNotification(values.eventName, values.visibility === 'public');
      
      // Reset form
      form.resetFields();
      setEventImageUrl('');
      setHasMerchandise(false);
      setSelectedMerchTypes([]);
      setMerchandiseData({});
      setFormProgress(0);

    } catch (error) {
      console.error('Error creating event:', error);
      message.error('❌ Failed to publish event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMerchTypeChange = (values) => {
    setSelectedMerchTypes(values);
    
    const updated = {};
    values.forEach(type => {
      updated[type] = merchandiseData[type] || { description: '', images: [] };
    });
    
    setMerchandiseData(updated);
  };

  const handleDescriptionChange = (type, value) => {
    setMerchandiseData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        description: value,
        images: prev[type]?.images || []
      }
    }));
  };

  const handleImageRemove = (type, file) => {
    setMerchandiseData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        images: prev[type]?.images?.filter((img) => img.uid !== file.uid) || []
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <CalendarOutlined className="text-white text-xl" />
            </div>
            <Title level={2} className="!mb-0 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New Event
            </Title>
          </div>
          <Text className="text-gray-600 text-lg">
            Build engaging experiences for the AIESEC community
          </Text>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 border-0 shadow-sm">
          <div className="flex items-center gap-4">
            <Text strong className="text-gray-700">Form Progress:</Text>
            <Progress 
              percent={formProgress} 
              size="small" 
              strokeColor={{
                '0%': '#3B82F6',
                '100%': '#6366F1',
              }}
              className="flex-1"
            />
            <Text className="text-sm text-gray-500">{formProgress}% Complete</Text>
          </div>
        </Card>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={calculateProgress}
          initialValues={{ 
            visibility: 'private', 
            eventType: 'in_person',
            registrationCloseBeforeDays: 1
          }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card 
            title={
              <Space>
                <FileImageOutlined className="text-blue-600" />
                <span>Basic Information</span>
              </Space>
            }
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <Form.Item 
                  name="eventName" 
                  label={<span className="font-semibold">Event Title</span>}
                  rules={[{ required: true, message: 'Please enter event title' }]}
                >
                  <Input 
                    placeholder="Enter a compelling event title" 
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>

              <div className="lg:col-span-2">
                <Form.Item 
                  name="description" 
                  label={<span className="font-semibold">Description</span>}
                  rules={[{ required: true, message: 'Please enter event description' }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Describe your event in detail - what makes it special?"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>

              <div className="lg:col-span-2">
                <Form.Item 
                  label={<span className="font-semibold">Event Image</span>}
                  required
                >
                  <Dragger
                    multiple={false}
                    maxCount={1}
                    beforeUpload={handleEventImageUpload}
                    showUploadList={false}
                    accept="image/*"
                    className="hover:border-blue-400 transition-colors duration-200"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: '#3B82F6' }} />
                    </p>
                    <p className="ant-upload-text">Click or drag image to upload</p>
                    <p className="ant-upload-hint">Support for JPG, PNG, WebP formats</p>
                  </Dragger>
                  {eventImageUrl && (
                    <div className="mt-4 text-center">
                      <img 
                        src={eventImageUrl} 
                        alt="Event preview" 
                        className="max-w-full h-48 object-cover rounded-lg shadow-md mx-auto" 
                      />
                      <Text className="text-green-600 mt-2 block">
                        <CheckCircleOutlined /> Image uploaded successfully
                      </Text>
                    </div>
                  )}
                </Form.Item>
              </div>
            </div>
          </Card>

          {/* Date and Time */}
          <Card 
            title={
              <Space>
                <ClockCircleOutlined className="text-blue-600" />
                <span>Date & Time</span>
              </Space>
            }
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item 
                name="startDate" 
                label={<span className="font-semibold">Start Date</span>}
                rules={[{ required: true, message: 'Please select start date' }]}
              >
                <DatePicker 
                  className="w-full rounded-lg" 
                  size="large"
                  disabledDate={disabledDate}
                  placeholder="Select start date"
                />
              </Form.Item>

              <Form.Item 
                name="endDate" 
                label={<span className="font-semibold">End Date</span>}
                rules={[{ required: true, message: 'Please select end date' }]}
              >
                <DatePicker 
                  className="w-full rounded-lg" 
                  size="large"
                  disabledDate={disabledDate}
                  placeholder="Select end date"
                />
              </Form.Item>

              <Form.Item 
                name="startTime" 
                label={<span className="font-semibold">Start Time</span>}
                rules={[{ required: true, message: 'Please select start time' }]}
              >
                <TimePicker 
                  use12Hours 
                  format="h:mm A" 
                  className="w-full rounded-lg" 
                  size="large"
                  placeholder="Select start time"
                />
              </Form.Item>

              <Form.Item 
                name="endTime" 
                label={<span className="font-semibold">End Time</span>}
                rules={[{ required: true, message: 'Please select end time' }]}
              >
                <TimePicker 
                  use12Hours 
                  format="h:mm A" 
                  className="w-full rounded-lg" 
                  size="large"
                  placeholder="Select end time"
                />
              </Form.Item>
            </div>
          </Card>

          {/* Location and Registration */}
          <Card 
            title={
              <Space>
                <EnvironmentOutlined className="text-blue-600" />
                <span>Location & Registration</span>
              </Space>
            }
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="space-y-6">
              <Form.Item label={<span className="font-semibold">Event Type</span>}>
                <Radio.Group 
                  value={eventType} 
                  onChange={(e) => setEventType(e.target.value)} 
                  className="flex gap-6"
                  size="large"
                >
                  <Radio value="in_person" className="text-base">
                    <Space>
                      <EnvironmentOutlined />
                      In Person
                    </Space>
                  </Radio>
                  <Radio value="virtual" className="text-base">
                    <Space>
                      <span>💻</span>
                      Virtual
                    </Space>
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item 
                name="location" 
                label={<span className="font-semibold">{eventType === 'virtual' ? 'Meeting Link' : 'Location'}</span>}
                rules={[{ required: true, message: `Please enter ${eventType === 'virtual' ? 'meeting link' : 'location'}` }]}
              >
                <Input 
                  placeholder={eventType === 'virtual' ? 'https://zoom.us/j/...' : 'Enter event location'} 
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item 
                name="registrationCloseBeforeDays"
                label={
                  <Space>
                    <span className="font-semibold">Close Registration Before (Days)</span>
                    <Tooltip title="Number of days before the event starts when registration should automatically close. Set to 0 to keep registration open until the event starts.">
                      <QuestionCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </Space>
                }
                rules={[{ 
                  type: 'number', 
                  min: 0, 
                  max: 30, 
                  message: 'Please enter a number between 0 and 30' 
                }]}
              >
                <InputNumber
                  placeholder="1"
                  size="large"
                  className="w-full rounded-lg"
                  min={0}
                  max={30}
                  addonAfter="days"
                />
              </Form.Item>

              <Alert
                message="Registration Management"
                description="Setting this to 1 day means registration will automatically close 1 day before the event starts. This gives you time to prepare attendee lists and materials."
                type="info"
                showIcon
                className="rounded-lg"
              />
            </div>
          </Card>

          {/* Merchandise */}
          <Card 
            title={
              <Space>
                <ShopOutlined className="text-blue-600" />
                <span>Merchandise</span>
              </Space>
            }
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Form.Item label={<span className="font-semibold">Merchandise Available?</span>}>
              <Radio.Group
                onChange={(e) => {
                  const value = e.target.value === 'yes';
                  setHasMerchandise(value);
                  if (!value) {
                    setSelectedMerchTypes([]);
                    setMerchandiseData({});
                  }
                }}
                value={hasMerchandise ? 'yes' : 'no'}
                className="flex gap-8"
                size="large"
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>

            {hasMerchandise && (
              <div className="space-y-6">
                <Form.Item label={<span className="font-semibold">Select Merchandise Items</span>}>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select items (e.g., T-Shirt, Cap)"
                    onChange={handleMerchTypeChange}
                    value={selectedMerchTypes}
                    size="large"
                    className="rounded-lg"
                  >
                    {['T-Shirt', 'Cap', 'Wristband', 'Hoodie', 'Mug', 'Sticker', 'Bag', 'Other'].map((item) => (
                      <Option key={item} value={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>

                {selectedMerchTypes.map((type) => (
                  <Card 
                    key={type} 
                    size="small" 
                    title={`${type} Details`}
                    className="bg-gray-50 border border-gray-200"
                  >
                    <div className="space-y-4">
                      <Form.Item label={`${type} Description`}>
                        <TextArea
                          rows={3}
                          placeholder={`Enter description for ${type} (e.g., sizes, colors, materials)`}
                          value={merchandiseData[type]?.description || ''}
                          onChange={(e) => handleDescriptionChange(type, e.target.value)}
                          className="rounded-lg"
                        />
                      </Form.Item>

                      <Form.Item label={`Upload ${type} Images`}>
                        <Upload
                          listType="picture-card"
                          multiple
                          accept="image/*"
                          onRemove={(file) => handleImageRemove(type, file)}
                          customRequest={({ file, onSuccess, onError }) =>
                            handleMerchImagesUpload(type, { file, onSuccess, onError })
                          }
                        >
                          <div className="text-center">
                            <PlusOutlined />
                            <div className="mt-2">Upload</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Visibility */}
          <Card 
            title={
              <Space>
                <EyeOutlined className="text-blue-600" />
                <span>Event Visibility</span>
              </Space>
            }
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Form.Item 
              name="visibility" 
              label={<span className="font-semibold">Who can register for this event?</span>}
              rules={[{ required: true, message: 'Please select event visibility' }]}
            >
              <Radio.Group className="flex flex-col gap-4" size="large">
                <Radio value="private" className="text-base">
                  <div>
                    <div className="font-medium">Private (AIESEC members only)</div>
                    <div className="text-gray-500 text-sm ml-6">Only AIESEC members can see and register for this event</div>
                  </div>
                </Radio>
                <Radio value="public" className="text-base">
                  <div>
                    <div className="font-medium">Public (Open to everyone)</div>
                    <div className="text-gray-500 text-sm ml-6">Anyone can see and register for this event</div>
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Card>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isSubmitting} 
              size="large"
              className="px-12 py-3 h-auto text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddEventForm;
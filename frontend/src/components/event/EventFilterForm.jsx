
import React from 'react';
import { Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const EventFilterForm = ({ filters, setFilters, onFilter }) => {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-4">
      <Input
        placeholder="Search by event name"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <Select
        value={filters.status}
        onChange={(value) => setFilters({ ...filters, status: value })}
        placeholder="Select status"
        style={{ width: 150 }}
        allowClear
      >
        <Option value="upcoming">Upcoming</Option>
        <Option value="past">Past</Option>
        <Option value="public">Public</Option>
        <Option value="private">Private</Option>
      </Select>

      <DatePicker
        value={filters.date ? dayjs(filters.date) : null}
        onChange={(date) =>
          setFilters({ ...filters, date: date ? date.format('YYYY-MM-DD') : '' })
        }
        placeholder="Select date"
      />

      <Button type="primary" onClick={onFilter}>
        Filter
      </Button>
    </div>
  );
};

export default EventFilterForm;

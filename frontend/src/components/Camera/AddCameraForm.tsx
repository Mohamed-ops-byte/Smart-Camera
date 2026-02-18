import React, { useState } from 'react';
import { Input, Select, Button } from '@components/Common';
import type { Camera } from '@/types';

interface AddCameraFormProps {
  onSubmit: (camera: Omit<Camera, 'id' | 'createdAt'>) => Promise<void>;
  isLoading?: boolean;
}

const AddCameraForm: React.FC<AddCameraFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    frameRate: 30,
    recordingEnabled: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      resolutionWidth: Number(formData.resolutionWidth),
      resolutionHeight: Number(formData.resolutionHeight),
      frameRate: Number(formData.frameRate),
      status: 'offline',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="اسم الكاميرا"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="مثال: كاميرا الباب الأمامي"
      />

      <Input
        label="الموقع"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        placeholder="مثال: الباب الأمامي"
      />

      <Select
        label="دقة الكاميرا"
        name="resolution"
        options={[
          { value: '1920x1080', label: 'Full HD (1920x1080)' },
          { value: '1280x720', label: 'HD (1280x720)' },
          { value: '640x480', label: 'VGA (640x480)' },
        ]}
        onChange={(e) => {
          const [width, height] = e.target.value.split('x');
          setFormData((prev) => ({
            ...prev,
            resolutionWidth: Number(width),
            resolutionHeight: Number(height),
          }));
        }}
      />

      <Select
        label="معدل الإطارات"
        name="frameRate"
        value={String(formData.frameRate)}
        onChange={handleChange}
        options={[
          { value: '15', label: '15 fps' },
          { value: '24', label: '24 fps' },
          { value: '30', label: '30 fps' },
          { value: '60', label: '60 fps' },
        ]}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="recordingEnabled"
          checked={formData.recordingEnabled}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium text-gray-700">تفعيل التسجيل</span>
      </label>

      <Button type="submit" variant="success" isLoading={isLoading} className="w-full">
        إضافة الكاميرا
      </Button>
    </form>
  );
};

export default AddCameraForm;

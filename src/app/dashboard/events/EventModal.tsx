'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select } from "@/components/ui/Select";
import { useOptionEvent } from "@/lib/helpers";

interface Event {
  id?: string;
  name: string;
  descriptions: string;
  slug: string;
  image_url: string;
  date: string;
  time: string;
  location: string;
  location_url: string;
  external_url: string;
  current_participants: number;
  max_participants: number;
  type: string;
  is_active: boolean;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSuccess: () => void;
}

const initialEvent: Event = {
  name: '',
  descriptions: '',
  slug: '',
  image_url: '',
  date: '',
  time: '',
  location: '',
  location_url: '',
  external_url: '',
  current_participants: 0,
  max_participants: 0,
  type: '',
  is_active: true,
};

export const EventModal = ({ isOpen, onClose, event, onSuccess }: EventModalProps) => {
  const [formData, setFormData] = useState<Event>(initialEvent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = async () => {
    const url = formData.image_url;
    const marker = `/object/public/ss_images/`;
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const path = url.slice(idx + marker.length);
      await fetch('/api/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
    }
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'events');

      const res = await fetch('/api/images', { method: 'POST', body: fd });
      const result = await res.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.data.url }));
      } else {
        setUploadError(result.message || 'Upload failed');
      }
    } catch {
      setUploadError('Network error. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData(initialEvent);
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = event?.id ? `/api/events/${event.id}` : '/api/events';
      const method = event?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
        onClose();
        setFormData(initialEvent)
      } else {
        setError(result.message || 'Failed to save event');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
    setFormData(prev => ({ ...prev, slug }));
  };

  // const optionsEvent = [
  //   'ASMR',
  //   'Exercise',
  //   'Run In The Wood',
  //   'Hoops',
  //   'Nyepak',
  //   'Nepak',
  // ]

  const optionsEvent = useOptionEvent();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Create Event'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Input
          label="Event Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => !event && generateSlug()}
          // onMouseOver={!event && generateSlug}          
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            // disabled
            required
          />
          <Select
            options={[{
              value: '',
              label: 'Select',
            }, ...optionsEvent.map((row) => ({
              value: row,
              label: row,
            }))]}
            label="Event Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <Textarea
          label="Description"
          name="descriptions"
          value={formData.descriptions}
          onChange={handleChange}
          rows={3}
        />

        {/* Image */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>

          {formData.image_url && (
            <div className="relative w-24 aspect-9/16 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Image
                src={formData.image_url}
                alt="Event preview"
                fill
                sizes="96px"
                unoptimized
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <Icon icon="lucide:x" width="14" height="14" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={uploading ? undefined : 'lucide:upload'}
              loading={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>

          <p className="text-xs text-gray-400">Max file size: 2 MB</p>

          {uploadError && (
            <p className="text-xs text-red-500">{uploadError}</p>
          )}

          <Input
            label="Or paste Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <Input
            label="Time"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <Input
          label="Location URL"
          name="location_url"
          value={formData.location_url}
          onChange={handleChange}
        />

        <Input
          label="External URL"
          name="external_url"
          value={formData.external_url}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Current Participants"
            type="number"
            name="current_participants"
            value={formData.current_participants}
            onChange={handleChange}
            min="0"
            required
          />
          <Input
            label="Max Participants"
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-sobat-blue"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">
            Active (visible to public)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {event ? 'Update' : 'Create'} Event
          </Button>
        </div>
      </form>
    </Modal>
  );
};
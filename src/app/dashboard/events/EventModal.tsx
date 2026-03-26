'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface Event {
  id?: string;
  name: string;
  descriptions: string;
  slug: string;
  image_url: string;
  date: string;
  time: string;
  location: string;
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
  current_participants: 0,
  max_participants: 0,
  type: '',
  is_active: true,
};

export const EventModal = ({ isOpen, onClose, event, onSuccess }: EventModalProps) => {
  const [formData, setFormData] = useState<Event>(initialEvent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          onBlur={!event && generateSlug}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
          <Input
            label="Event Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., asmr, night-run, exercise"
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

        <Input
          label="Image URL"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://..."
        />

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
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import ImageUploader from '@/components/image-uploader/ImageUploader';

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    time: '',
    memo: ''
  });
  const [eventImage, setEventImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement event creation logic
    console.log('Creating event:', formData);
    console.log('Event image:', eventImage);
    // Navigate to dashboard or event view after creation
    router.push('/dashboard');
  };

  const handleImageChange = (file: File | null) => {
    setEventImage(file);
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push('/auth/sign-in');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logout} onClick={handleLogout}>
          Logout
        </div>
        <div className={styles.greenLine}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.labelHeader}>
            <button className={styles.closeButton} onClick={handleClose}>
            ×
            </button>
            <h1 className={styles.title}>Create your event</h1>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter event name"
                required
              />
            </div>

            <div className={styles.dateTimeGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Memo</label>
              <textarea
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
                className={`${styles.input} ${styles.memoInput}`}
                placeholder="Enter event description..."
                rows={5}
              />
            </div>

            <button type="submit" className={styles.createButton}>
              Create
            </button>
          </form>
        </div>

        <div className={styles.rightSection}>
          <ImageUploader 
            onImageChange={handleImageChange}
            className={styles.imageUploader}
          />
        </div>
      </div>
    </div>
  );
}

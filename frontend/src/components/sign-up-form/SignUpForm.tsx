'use client';

import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
import { Event } from '@/types';
import EventCard from '../event-card/EventCard';

interface SignUpFormProps {
  event: Event;
}

export default function SignUpForm({ event }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [transportationOption, setTransportationOption] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Handle form submission
    console.log({ name, email, password, transportationOption });
  };

  return (
    <div className={styles.content}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>Sign up for: {event.title}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              How will you be getting to the event?
            </label>
            <div className={styles.buttonGroup}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className={`${styles.button} ${transportationOption === 'driving' ? styles.active : ''}`}
                  onClick={() => setTransportationOption('driving')}
                >
                  Driving (can drive others too)
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${transportationOption === 'needs_ride' ? styles.active : ''}`}
                  onClick={() => setTransportationOption('needs_ride')}
                >
                  Need a ride
                </button>
              </div>
              <button
                type="button"
                className={`${styles.button} ${transportationOption === 'on_my_own' ? styles.active : ''}`}
                onClick={() => setTransportationOption('on_my_own')}
              >
                Getting there on my own
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              placeholder="Name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className={styles.createButton}>
            Create account
          </button>
        </form>
      </div>
      <div className={styles.rightSection}>
        <EventCard
          key={event.id}
          event={event}
          variant="dashboard"
          onClick={() => {}}
          className={styles.eventCard}
        />
      </div>
    </div>
  );
}

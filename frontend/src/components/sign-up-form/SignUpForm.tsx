'use client';

import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
import { Event } from '@/types';
import EventCard from '../event-card/EventCard';
import LocationMapSelector from '../LocationMapSelector/LocationMapSelector';
import Modal from '../Modal/Modal'; // Added import

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
  const [leavingFrom, setLeavingFrom] = useState<{
    lat: number;
    lng: number;
    name: string;
    fullAddress: string;
  } | null>(null);
  const [comingBackTo, setComingBackTo] = useState<{
    lat: number;
    lng: number;
    name: string;
    fullAddress: string;
  } | null>(null);
  const [pickupAt, setPickupAt] = useState<{
    lat: number;
    lng: number;
    name: string;
    fullAddress: string;
  } | null>(null); // New state
  const [dropoffAt, setDropoffAt] = useState<{
    lat: number;
    lng: number;
    name: string;
    fullAddress: string;
  } | null>(null); // New state
  const [capacity, setCapacity] = useState(0);
  const [error, setError] = useState('');

  const [isLeavingFromModalOpen, setIsLeavingFromModalOpen] = useState(false);
  const [isComingBackToModalOpen, setIsComingBackToModalOpen] = useState(false);
  const [isPickupAtModalOpen, setIsPickupAtModalOpen] = useState(false); // New state
  const [isDropoffAtModalOpen, setIsDropoffAtModalOpen] = useState(false); // New state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Handle form submission
    console.log({
      name,
      email,
      password,
      transportationOption,
      leavingFrom,
      comingBackTo,
      pickupAt, // Added to console.log
      dropoffAt, // Added to console.log
      capacity,
    });
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
            {transportationOption === '' && (
              <p style={{ color: 'grey', fontStyle: 'italic' }}>
                Please first select one of the options above
              </p>
            )}
          </div>

          {transportationOption === 'driving' && (
            <div className={styles.formGroup}>
              <h2 className={styles.subtitle}>Driver Confirmation</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Leaving From</label>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setIsLeavingFromModalOpen(true)}
                >
                  {leavingFrom
                    ? `Change: ${leavingFrom.name}`
                    : 'Select Location on Map'}
                </button>
                {leavingFrom && <p>Full Address: {leavingFrom.fullAddress}</p>}

                <Modal
                  isOpen={isLeavingFromModalOpen}
                  onClose={() => setIsLeavingFromModalOpen(false)}
                  title="Select Leaving From Location"
                >
                  <LocationMapSelector
                    onSelectLocation={(loc) => {
                      setLeavingFrom(loc);
                      setIsLeavingFromModalOpen(false); // Close modal after selection
                    }}
                    initialLocation={leavingFrom || undefined}
                  />
                </Modal>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Coming Back To</label>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setIsComingBackToModalOpen(true)}
                >
                  {comingBackTo
                    ? `Change: ${comingBackTo.name}`
                    : 'Select Location on Map'}
                </button>
                {comingBackTo && (
                  <p>Full Address: {comingBackTo.fullAddress}</p>
                )}

                <Modal
                  isOpen={isComingBackToModalOpen}
                  onClose={() => setIsComingBackToModalOpen(false)}
                  title="Select Coming Back To Location"
                >
                  <LocationMapSelector
                    onSelectLocation={(loc) => {
                      setComingBackTo(loc);
                      setIsComingBackToModalOpen(false); // Close modal after selection
                    }}
                    initialLocation={comingBackTo || undefined}
                  />
                </Modal>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Capacity</label>
                <input
                  type="number"
                  placeholder="Enter capacity"
                  className={styles.input}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          )}
          {transportationOption === 'needs_ride' && ( // New block
            <div className={styles.formGroup}>
              <h2 className={styles.subtitle}>Passenger Details</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pickup At</label>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setIsPickupAtModalOpen(true)}
                >
                  {pickupAt
                    ? `Change: ${pickupAt.name}`
                    : 'Select Pickup Location on Map'}
                </button>
                {pickupAt && <p>Full Address: {pickupAt.fullAddress}</p>}

                <Modal
                  isOpen={isPickupAtModalOpen}
                  onClose={() => setIsPickupAtModalOpen(false)}
                  title="Select Pickup Location"
                >
                  <LocationMapSelector
                    onSelectLocation={(loc) => {
                      setPickupAt(loc);
                      setIsPickupAtModalOpen(false);
                    }}
                    initialLocation={pickupAt || undefined}
                  />
                </Modal>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dropoff At</label>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setIsDropoffAtModalOpen(true)}
                >
                  {dropoffAt
                    ? `Change: ${dropoffAt.name}`
                    : 'Select Dropoff Location on Map'}
                </button>
                {dropoffAt && <p>Full Address: {dropoffAt.fullAddress}</p>}

                <Modal
                  isOpen={isDropoffAtModalOpen}
                  onClose={() => setIsDropoffAtModalOpen(false)}
                  title="Select Dropoff Location"
                >
                  <LocationMapSelector
                    onSelectLocation={(loc) => {
                      setDropoffAt(loc);
                      setIsDropoffAtModalOpen(false);
                    }}
                    initialLocation={dropoffAt || undefined}
                  />
                </Modal>
              </div>
            </div>
          )}
          {transportationOption === 'on_my_own' && (
            <div className={styles.formGroup}>
              <h2 className={styles.subtitle}>Attendee Details</h2>
              <p>
                You've chosen to get to the event on your own. We look forward
                to seeing you there!
              </p>
            </div>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {transportationOption && (
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          )}
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

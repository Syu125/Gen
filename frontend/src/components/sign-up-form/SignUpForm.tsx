'use client';

import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
import { Event } from '@/types';
import EventCard from '../event-card/EventCard';
import LocationMapSelector from '../LocationMapSelector/LocationMapSelector';
import Modal from '../Modal/Modal'; // Added import
import { FaSearch } from 'react-icons/fa';
import { useSession } from 'next-auth/react'; // Added import
import { useRouter } from 'next/navigation'; // Added import

interface SignUpFormProps {
  event: Event;
}

export default function SignUpForm({ event }: SignUpFormProps) {
  const { data: session } = useSession(); // Get session data
  const userId = session?.user?.id; // Extract userId
  const router = useRouter(); // Initialize router

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

  const handleSubmit = async (e: React.FormEvent) => {
    // Made async
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!userId) {
      setError('User not logged in.');
      return;
    }

    if (!event.id) {
      setError('Event ID is missing.');
      return;
    }

    let payload = {};
    let endpoint = '';

    switch (transportationOption) {
      case 'driving':
        if (!leavingFrom || !comingBackTo || capacity === 0) {
          setError('Please fill all driver details.');
          return;
        }
        payload = {
          userId,
          eventId: event.id,
          leavingFrom,
          comingBackTo,
          capacity,
        };
        endpoint = '/api/sign-up/driver';
        break;
      case 'needs_ride':
        if (!pickupAt || !dropoffAt) {
          setError('Please fill all passenger details.');
          return;
        }
        payload = {
          userId,
          eventId: event.id,
          pickupAt,
          dropoffAt,
        };
        endpoint = '/api/sign-up/passenger';
        break;
      case 'on_my_own':
        payload = {
          userId,
          eventId: event.id,
        };
        endpoint = '/api/sign-up/attendee';
        break;
      default:
        setError('Please select a transportation option.');
        return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign up.');
      }

      const data = await response.json();
      console.log('Sign up successful:', data);
      router.push('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error('Sign up error:', err);
      setError(
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: string }).message)
          : 'An unexpected error occurred.'
      );
    }
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
                  style={{
                    color: leavingFrom ? 'black' : 'grey',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '8px' }}>
                    {' '}
                    {/* Added margin-right */}
                    {leavingFrom
                      ? `${leavingFrom.name}`
                      : 'Select Location on Map'}
                  </span>
                  <FaSearch style={{ color: 'grey' }} />
                </button>
                {leavingFrom && (
                  <p style={{ color: 'grey' }}>
                    Address: {leavingFrom.fullAddress}
                  </p>
                )}

                <Modal
                  isOpen={isLeavingFromModalOpen}
                  onClose={() => setIsLeavingFromModalOpen(false)}
                  title="Select Leaving From Location"
                >
                  <LocationMapSelector
                    onSelectLocation={(loc) => {
                      setLeavingFrom(loc);
                      setComingBackTo(loc); // Automatically populate Coming Back To
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
                  style={{
                    color: comingBackTo ? 'black' : 'grey',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '8px' }}>
                    {' '}
                    {/* Added margin-right */}
                    {comingBackTo
                      ? `${comingBackTo.name}`
                      : 'Select Location on Map'}
                  </span>
                  <FaSearch style={{ color: 'grey' }} />
                </button>
                {comingBackTo && (
                  <p style={{ color: 'grey' }}>
                    Address: {comingBackTo.fullAddress}
                  </p>
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
                <label className={styles.label}>
                  Capacity (How many other people can you drive?)
                </label>
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
                  style={{
                    color: pickupAt ? 'black' : 'grey',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '8px' }}>
                    {' '}
                    {/* Added margin-right */}
                    {pickupAt
                      ? `${pickupAt.name}`
                      : 'Select Pickup Location on Map'}
                  </span>
                  <FaSearch style={{ color: 'grey' }} />
                </button>
                {pickupAt && (
                  <p style={{ color: 'grey' }}>
                    Full Address: {pickupAt.fullAddress}
                  </p>
                )}

                <Modal
                  isOpen={isPickupAtModalOpen}
                  onClose={() => setIsPickupAtModalOpen(false)}
                  title="Select Pickup Location"
                >
                  <LocationMapSelector
                    onSelectLocation={(loc) => {
                      setPickupAt(loc);
                      setDropoffAt(loc); // Automatically populate Dropoff At
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
                  style={{
                    color: dropoffAt ? 'black' : 'grey',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '8px' }}>
                    {' '}
                    {/* Added margin-right */}
                    {dropoffAt
                      ? `${dropoffAt.name}`
                      : 'Select Dropoff Location on Map'}
                  </span>
                  <FaSearch style={{ color: 'grey' }} />
                </button>
                {dropoffAt && (
                  <p style={{ color: 'grey' }}>
                    Full Address: {dropoffAt.fullAddress}
                  </p>
                )}

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
                You&apos;ve chosen to get to the event on your own. We look
                forward to seeing you there!
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

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard';
import { Event } from '@/types';

interface Participant {
  name: string;
  role: 'Driver' | 'Passenger' | 'Attendee';
  leaving_from?: string;
  coming_back_to?: string;
  pickup_at?: string;
  dropoff_at?: string;
}

export default function ViewEvent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId) {
        setIsLoading(true);
        try {
          // Fetch event details
          const eventRes = await fetch(
            `http://localhost:5000/api/events/${eventId}`
          );
          if (eventRes.ok) {
            const eventData = await eventRes.json();
            setEvent(eventData);
          } else {
            console.error('Failed to fetch event data');
            setEvent(null);
          }

          // Fetch participants
          const participantsRes = await fetch(
            `http://localhost:5000/api/events/${eventId}/participants`
          );
          if (participantsRes.ok) {
            const participantsData = await participantsRes.json();
            setParticipants(participantsData);
          } else {
            console.error('Failed to fetch participants');
          }
        } catch (error) {
          console.error('Error fetching event data:', error);
          setEvent(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push('/');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting event data...');
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.page}>
        <p>Event not found.</p>
      </div>
    );
  }

  const passengerCount = participants.filter(
    (p) => p.role === 'Passenger'
  ).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <div className={styles.backArrow}></div>
        </button>
        <div className={styles.logout} onClick={handleLogout}>
          Logout
        </div>
        <div className={styles.greenLine}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftSection}>
          <EventCard event={event} variant="dashboard" />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Pickup</th>
                  <th>Dropoff</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.passengerName}>
                      {participant.name}
                    </td>
                    <td>{participant.role}</td>
                    <td className={styles.location}>
                      {participant.role === 'Driver'
                        ? participant.leaving_from
                        : participant.pickup_at || '-'}
                    </td>
                    <td className={styles.location}>
                      {participant.role === 'Driver'
                        ? participant.coming_back_to
                        : participant.dropoff_at || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.tableFooter}>
              <div className={styles.passengerCount}>
                {passengerCount} Passengers
              </div>
              <button className={styles.exportButton} onClick={handleExport}>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

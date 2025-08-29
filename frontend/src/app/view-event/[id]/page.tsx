'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard';

interface Attendee {
  id: number;
  name: string;
  pickupLocation: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffTime: string;
}

export default function ViewEvent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  // Mock event data - in real app, this would come from API
  const event = {
    id: Number(eventId),
    code: 'C9NG7H',
    title: 'Praise & Prayer',
    subtitle: 'Night',
    date: 'Feb 19',
    time: '8:00PM',
    description: 'A night of praise and prayer.',
    location: 'Main Hall',
    creator_id: '1',
  };

  // Mock attendees data
  const attendees: Attendee[] = [
    {
      id: 1,
      name: 'You',
      pickupLocation: '-',
      pickupTime: '-',
      dropoffLocation: '-',
      dropoffTime: '-',
    },
    {
      id: 2,
      name: 'Passenger 1',
      pickupLocation: 'Costa Verde',
      pickupTime: '-',
      dropoffLocation: 'Costa Verde',
      dropoffTime: '-',
    },
    {
      id: 3,
      name: 'Passenger 2',
      pickupLocation: 'Warren College',
      pickupTime: '-',
      dropoffLocation: 'Warren College',
      dropoffTime: '-',
    },
    {
      id: 4,
      name: 'Passenger 3',
      pickupLocation: 'Seventh College',
      pickupTime: '-',
      dropoffLocation: 'Seventh College',
      dropoffTime: '-',
    },
    {
      id: 5,
      name: 'Passenger 4',
      pickupLocation: 'Seventh College',
      pickupTime: '-',
      dropoffLocation: 'Seventh College',
      dropoffTime: '-',
    },
  ];

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

  const passengerCount = attendees.length - 1; // Exclude "You"

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
                  <th>Pickup Location</th>
                  <th>Pickup Time</th>
                  <th>Dropoff Location</th>
                  <th>Dropoff Time</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr key={attendee.id} className={styles.tableRow}>
                    <td className={styles.passengerName}>{attendee.name}</td>
                    <td className={styles.location}>
                      {attendee.pickupLocation}
                    </td>
                    <td className={styles.time}>{attendee.pickupTime}</td>
                    <td className={styles.location}>
                      {attendee.dropoffLocation}
                    </td>
                    <td className={styles.time}>{attendee.dropoffTime}</td>
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

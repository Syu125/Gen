'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard';

export default function Dashboard() {
  const router = useRouter();
  const [eventCode, setEventCode] = useState('');

  const featuredEvent = {
    id: 1,
    code: 'C9NG7H',
    title: 'Praise & Prayer',
    subtitle: 'Night',
    date: 'Feb 19',
    time: '8:00PM',
    type: 'UPCOMING EVENT',
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventCode.trim()) {
      // TODO: Implement sign-up logic
      console.log('Signing up for event with code:', eventCode);
      router.push('/dashboard');
    }
  };

  const handleCreateEvent = () => {
    router.push('/create-event');
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push('/');
  };

  const handleViewAllEvents = () => {
    router.push('/all-events');
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/view-event/${eventId}`);
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logout} onClick={handleLogout}>
          Logout
        </div>
        <div className={styles.greenLine}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftSection}>
          <EventCard
            event={featuredEvent}
            variant="dashboard"
            onClick={handleEventClick}
          />

          <div className={styles.viewAllEvents} onClick={handleViewAllEvents}>
            View all your events
          </div>
        </div>

        <div className={styles.rightSection}>
          <h1 className={styles.title}>Sign up for an event</h1>
          <div className={styles.prompt}>Enter the code below:</div>

          <form onSubmit={handleSignUp}>
            <input
              type="text"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              className={styles.input}
              placeholder="Enter event code"
            />

            <div className={styles.buttons}>
              <button type="submit" className={styles.signUpButton}>
                Sign up
              </button>
              <button
                type="button"
                className={styles.createButton}
                onClick={handleCreateEvent}
              >
                Create your own event
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

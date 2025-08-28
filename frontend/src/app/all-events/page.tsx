'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard';

export default function AllEvents() {
  const router = useRouter();

  const events = [
    { id: 1, code: 'C9NG7H', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM' },
    { id: 2, code: 'A7B2K9', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM' },
    { id: 3, code: 'X4M8P3', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM' },
    { id: 4, code: 'L5N1Q6', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM' },
    { id: 5, code: 'R8S2T4', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM' },
    { id: 6, code: 'W3U7V9', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM' },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push('/auth/sign-in');
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/view-event/${eventId}`);
  };

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Loading more events...');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logout} onClick={handleLogout}>
          Logout
        </div>
        <div className={styles.greenLine}></div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          <a href="/dashboard">
            <img src="/home.svg" alt="Home" className={styles.homeIcon} />
          </a>
          Your Events
        </h1>

        <div className={styles.eventsGrid}>
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              variant="grid"
              onClick={handleEventClick}
              className={styles[`grid${index + 1}`]}
            />
          ))}
        </div>

        <div className={styles.loadMore}>
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            Load More Events
          </button>
        </div>
      </div>
    </div>
  );
}

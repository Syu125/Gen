'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AllEvents() {
  const router = useRouter();

  const events = [
    { id: 1, code: 'C9NG7H', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM', className: styles.eventCard1 },
    { id: 2, code: 'A7B2K9', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM', className: styles.eventCard2 },
    { id: 3, code: 'X4M8P3', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM', className: styles.eventCard3 },
    { id: 4, code: 'L5N1Q6', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM', className: styles.eventCard4 },
    { id: 5, code: 'R8S2T4', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM', className: styles.eventCard5 },
    { id: 6, code: 'W3U7V9', title: 'Praise & Prayer Night', date: 'Feb 19 | 8:00PM', className: styles.eventCard6 },
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
          <div className={styles.homeIcon}></div>
          Your Events
        </h1>

        <div className={styles.eventsGrid}>
          {events.map((event) => (
            <div
              key={event.id}
              className={`${styles.eventCard} ${event.className}`}
              onClick={() => handleEventClick(event.id)}
            >
              <div className={styles.eventCardContent}>
                <div className={styles.eventCode}>
                  <div className={styles.eventCodeIcon}></div>
                  {event.code}
                </div>
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventDateTime}>{event.date}</div>
              </div>
            </div>
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

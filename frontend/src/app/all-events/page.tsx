'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard';
import Image from 'next/image';

type Event = {
  id: number;
  code: string;
  title: string;
  date: string;
  subtitle?: string;
  time?: string;
  type?: string;
  image_url?: string;
  [key: string]: any;
};

export default function AllEvents() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userEvents, setUserEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/users/${session.user.id}/events`
          );
          if (res.ok) {
            const events = await res.json();
            setUserEvents(events);
          } else {
            console.error('Failed to fetch user events');
          }
        } catch (error) {
          console.error('Error fetching user events:', error);
        }
      }
    };

    fetchUserEvents();
  }, [session]);

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
            <Image
              src="/home.svg"
              alt="Home"
              className={styles.homeIcon}
              width={32}
              height={32}
            />
          </a>
          Your Events
        </h1>

        <div className={styles.eventsGrid}>
          {userEvents.length > 0 ? (
            userEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                variant="grid"
                onClick={handleEventClick}
                className={styles[`grid${index + 1}`]}
              />
            ))
          ) : (
            <p>No events created yet.</p>
          )}
        </div>

        <div className={styles.loadMore}>
          {userEvents.length > 6 && (
            <p className={styles.showMoreText} onClick={handleLoadMore}>
              Show more events
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

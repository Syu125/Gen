'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard';
import Image from 'next/image';
import { Event } from '@/types';

export default function AllEvents() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userEvents, setUserEvents] = useState<Event[]>([]); // Events created by user
  const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]); // Events user signed up for
  const [allEventsForDisplay, setAllEventsForDisplay] = useState<Event[]>([]); // Combined events

  useEffect(() => {
    const fetchAllEvents = async () => { // Renamed function
      if (session?.user?.id) {
        try {
          // Fetch events created by the user
          const createdRes = await fetch(
            `http://localhost:5000/api/users/${session.user.id}/events`
          );
          let createdEvents: Event[] = [];
          if (createdRes.ok) {
            createdEvents = await createdRes.json();
            setUserEvents(createdEvents);
          } else {
            console.error('Failed to fetch created events');
          }

          // Fetch events the user has signed up for
          const signedUpRes = await fetch(
            `http://localhost:5000/api/users/${session.user.id}/signed-up-events`
          );
          let signedUpEventsData: Event[] = [];
          if (signedUpRes.ok) {
            signedUpEventsData = await signedUpRes.json();
            setSignedUpEvents(signedUpEventsData);
          } else {
            console.error('Failed to fetch signed-up events');
          }

          // Combine and deduplicate events
          const combinedEventsMap = new Map<number, Event>();
          [...createdEvents, ...signedUpEventsData].forEach((event) => {
            combinedEventsMap.set(event.id, event);
          });
          const combinedEvents = Array.from(combinedEventsMap.values());
          setAllEventsForDisplay(combinedEvents);

        } catch (error) {
          console.error('Error fetching all events:', error);
        }
      }
    };

    fetchAllEvents(); // Call the renamed function
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
          {allEventsForDisplay.length > 0 ? ( // Changed from userEvents.length
            allEventsForDisplay.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                variant="grid"
                onClick={handleEventClick}
                className={styles[`grid${index + 1}`]}
              />
            ))
          ) : (
            <p>No events found.</p> // Changed text
          )}
        </div>

        <div className={styles.loadMore}>
          {allEventsForDisplay.length > 6 && ( // Changed from userEvents.length
            <p className={styles.showMoreText} onClick={handleLoadMore}>
              Show more events
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

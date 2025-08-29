'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard'; // Added comment to force re-compilation

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [eventCode, setEventCode] = useState('');
  const [userEvents, setUserEvents] = useState([]);
  const [mostRecentUpcomingEvent, setMostRecentUpcomingEvent] = useState(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`http://localhost:5000/api/users/${session.user.id}/events`);
          if (res.ok) {
            const events = await res.json();
            setUserEvents(events);

            // Filter for upcoming events and find the most recent one
            const now = new Date();
            const upcomingEvents = events.filter(event => new Date(event.date) > now);
            if (upcomingEvents.length > 0) {
              const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              setMostRecentUpcomingEvent(sortedEvents[0]);
            } else {
              setMostRecentUpcomingEvent(null); // Set to null if no upcoming events
            }
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

      <div className={`${styles.content} ${userEvents.length === 0 ? styles.contentCentered : ''}`}>
        <div className={styles.leftSection}>
          {mostRecentUpcomingEvent ? (
            <EventCard
              event={mostRecentUpcomingEvent}
              variant="dashboard"
              onClick={handleEventClick}
            />
          ) : (
            <p>No upcoming events.</p>
          )}

          <div className={styles.viewAllEvents} onClick={handleViewAllEvents}>
            View all your events
          </div>
        </div>

        <div className={`${styles.rightSection} ${userEvents.length === 0 ? styles.rightSectionCentered : ''}`}>
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

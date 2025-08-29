'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import EventCard from '@/components/event-card/EventCard';
import { Event } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [eventCode, setEventCode] = useState('');
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [mostRecentUpcomingEvent, setMostRecentUpcomingEvent] =
    useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventCodeError, setEventCodeError] = useState('');

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (session?.user?.id) {
        setIsLoading(true); // Set loading to true before fetching
        try {
          const res = await fetch(
            `http://localhost:5000/api/users/${session.user.id}/events`
          );
          if (res.ok) {
            const events: Event[] = await res.json();
            setUserEvents(events);

            // Filter for upcoming events and find the most recent one
            const now = new Date();
            const upcomingEvents = events.filter(
              (event: Event) => new Date(event.date) > now
            );
            if (upcomingEvents.length > 0) {
              const sortedEvents = upcomingEvents.sort(
                (a: Event, b: Event) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              setMostRecentUpcomingEvent(sortedEvents[0]);
            } else {
              setMostRecentUpcomingEvent(null); // Set to null if no upcoming events
            }
          } else {
            console.error('Failed to fetch user events');
          }
        } catch (error) {
          console.error('Error fetching user events:', error);
        } finally {
          setIsLoading(false); // Set loading to false after fetching
        }
      }
    };

    fetchUserEvents();
  }, [session]);

  if (isLoading) {
    return <p>Loading...</p>; // Or a more sophisticated loading spinner
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventCodeError(''); // Clear previous errors

    if (!eventCode.trim()) {
      setEventCodeError('Event code cannot be empty');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/events/code/${eventCode}`
      );
      if (res.ok) {
        // Event found, proceed to sign-up page
        router.push(`/sign-up-event?code=${eventCode}`);
      } else if (res.status === 404) {
        setEventCodeError('Event code is invalid');
      } else {
        setEventCodeError('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error validating event code:', error);
      setEventCodeError('An error occurred. Please try again.');
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

      <div
        className={`${styles.content} ${userEvents.length === 0 ? styles.contentCentered : ''}`}
      >
        {userEvents.length > 0 && (
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
        )}

        <div
          className={`${styles.rightSection} ${userEvents.length === 0 ? styles.rightSectionCentered : ''}`}
        >
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
            {eventCodeError && (
              <p
                style={{
                  color: 'red',
                  fontStyle: 'italic',
                  marginTop: '-15px',
                  marginBottom: '15px',
                }}
              >
                {eventCodeError}
              </p>
            )}

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

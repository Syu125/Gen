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
  // const [userEvents, setUserEvents] = useState<Event[]>([]); // Events created by user
  // const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]); // Events user signed up for
  const [allEventsForDisplay, setAllEventsForDisplay] = useState<Event[]>([]); // Combined events
  const [featuredEvent, setFeaturedEvent] =
    useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventCodeError, setEventCodeError] = useState('');

  useEffect(() => {
    const fetchAllEvents = async () => {
      if (session?.user?.id) {
        setIsLoading(true);
        try {
          // Fetch events created by the user
          const createdRes = await fetch(
            `http://localhost:5000/api/users/${session.user.id}/events`
          );
          let createdEvents: Event[] = [];
          if (createdRes.ok) {
            createdEvents = await createdRes.json();
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

          // Determine the featured event
          const now = new Date();
          const upcomingEvents = combinedEvents.filter(
            (event: Event) => new Date(event.date) > now
          );

          if (upcomingEvents.length > 0) {
            const sortedEvents = upcomingEvents.sort(
              (a: Event, b: Event) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setFeaturedEvent(sortedEvents[0]);
          } else {
            setFeaturedEvent(null);
          }
        } catch (error) {
          console.error('Error fetching all events:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAllEvents();
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
        router.push(`/sign-up/${eventCode}`);
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
        className={`${styles.content} ${allEventsForDisplay.length === 0 ? styles.contentCentered : ''}`}
      >
        {allEventsForDisplay.length > 0 && (
          <div className={styles.leftSection}>
            <div className={styles.leftSectionTop}>
              {featuredEvent ? (
                <EventCard
                  event={featuredEvent}
                  variant="dashboard"
                  onClick={handleEventClick}
                />
              ) : (
                <p>No upcoming events.</p>
              )}
            </div>

            <div className={styles.viewAllEvents} onClick={handleViewAllEvents}>
              View all your events
            </div>
          </div>
        )}

        <div
          className={`${styles.rightSection} ${allEventsForDisplay.length === 0 ? styles.rightSectionCentered : ''}`}
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

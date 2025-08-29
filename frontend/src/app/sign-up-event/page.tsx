'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Event } from '@/types';

export default function SignUpEvent() {
  const searchParams = useSearchParams();
  const eventCode = searchParams.get('code');
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventCode) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/events/code/${eventCode}`
          );
          if (res.ok) {
            const eventData: Event = await res.json();
            setEvent(eventData);
          } else if (res.status === 404) {
            setError('Event code is invalid');
          } else {
            setError('An error occurred while fetching the event.');
          }
        } catch (err) {
          setError('An error occurred while fetching the event.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('No event code provided.');
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventCode]);

  if (isLoading) {
    return <div>Loading event details...</div>;
  }

  return (
    <div>
      <h1>Sign Up for Event</h1>
      {error && <p style={{ color: 'red', fontStyle: 'italic' }}>{error}</p>}
      {event ? (
        <div>
          <p>Event Code: {event.code}</p>
          <p>Event Title: {event.title}</p>
          {/* More event details and form will go here */}
        </div>
      ) : (
        !error && <p>No event found with the provided code.</p>
      )}
    </div>
  );
}

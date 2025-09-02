'use client';

import SignUpForm from '@/components/sign-up-form/SignUpForm';
import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { useParams } from 'next/navigation';

// interface SignUpPageProps {
//   params: {
//     eventCode: string;
//   };
// }

export default function SignUpPage() {
  const { eventCode } = useParams<{ eventCode: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventCode) {
      fetch(`http://localhost:5000/api/events/code/${eventCode}`)
        .then((res) => res.json())
        .then((data) => {
          setEvent(data);
          setLoading(false);
        });
    }
  }, [eventCode]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  return <SignUpForm event={event} />;
}

import React, { useState } from 'react';
import styles from './EventCard.module.css';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface EventCardProps {
  event: {
    id: number;
    code: string;
    title: string;
    subtitle?: string;
    date: string;
    time?: string;
    type?: string;
  };
  variant?: 'dashboard' | 'grid';
  onClick?: (eventId: number) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  variant = 'grid', 
  onClick,
  className 
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(event.id);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    navigator.clipboard.writeText(event.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const cardClass = `${styles.eventCard} ${styles[variant]} ${className || ''}`;

  return (
    <div className={cardClass} onClick={handleClick}>
      <div className={styles.eventCardContent}>
        <div className={styles.eventCode}>
          {copied ? (
            <FaCheck className={`${styles.eventCodeIcon} ${styles.copied}`} />
          ) : (
            <FaCopy className={styles.eventCodeIcon} onClick={handleCopy} style={{ cursor: 'pointer' }} />
          )}
          {event.code}
        </div>
        
        {event.type && (
          <div className={styles.eventType}>{event.type}</div>
        )}
        
        <div className={styles.eventTitle}>{event.title}</div>
        
        {event.subtitle && (
          <div className={styles.eventSubtitle}>{event.subtitle}</div>
        )}
        
        <div className={styles.eventDateTime}>
          {event.time ? `${event.date} | ${event.time}` : event.date}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 
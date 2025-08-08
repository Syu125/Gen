import React from 'react';
import styles from './EventCard.module.css';

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
  const handleClick = () => {
    if (onClick) {
      onClick(event.id);
    }
  };

  const cardClass = `${styles.eventCard} ${styles[variant]} ${className || ''}`;

  return (
    <div className={cardClass} onClick={handleClick}>
      <div className={styles.eventCardContent}>
        <div className={styles.eventCode}>
          <div className={styles.eventCodeIcon}></div>
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
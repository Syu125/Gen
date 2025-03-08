'use client';
import { useEffect, useState } from 'react';

import styles from './page.module.css';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000') // Call backend
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.contentFrame}>
        <div className={styles.content}></div>
      </div>
    </main>
  );
}

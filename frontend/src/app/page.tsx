'use client';
import { useEffect, useState } from 'react';

import Button from '../components/button/Button';

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
    <main className={`bg-custom ${styles.page}`}>
      <div className={styles.contentFrame}>
        <div className={styles.content}>
          <div className={styles.details}>
            <div className={`title`}>Hello! Welcome to Gen</div>
            <div className={styles.actions}>
              <div>Log in</div>
              <input className={styles.input} value="Email"></input>
              <input className={styles.input} value="Password"></input>
              <div className={styles.buttons}>
                <Button className={styles.login} text="Login"></Button>
                <Button
                  className={styles.newAccount}
                  text="Create new account"
                ></Button>
              </div>
            </div>
          </div>

          <div>
            <img
              className={styles.wallpaper}
              src="/landing-page/leaves.png"
            ></img>
          </div>
        </div>
      </div>
    </main>
  );
}

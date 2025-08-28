import React from 'react';

import styles from './MainAction.module.css';
import Button from '../button/Button';
import router from 'next/router';

const MainAction: React.FC = () => {
  const directDashboard = () => {
    router.push('/dashboard');
  };
  const directNewEvent = () => {
    router.push('/create-event');
  };
  return (
    <div className={styles.contentFrame}>
      <div className={styles.title}>Sign up for an event</div>
      <div className={styles.actions}>
        <div className={styles.prompt}>Enter the code below:</div>
        <input className={styles.input} value=""></input>
        <div className={styles.buttons}>
          <Button
            className={styles.signUpButton}
            text="Sign up"
            onClick={directDashboard}
          ></Button>
          <Button
            className={styles.createButton}
            text="Create your own event"
            onClick={directNewEvent}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default MainAction;

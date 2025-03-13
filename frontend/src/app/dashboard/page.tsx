import styles from './page.module.css';

import MainAction from '@/components/main-action/MainAction';

export default function Dashboard() {
  return (
    <main className={styles.page}>
      <MainAction></MainAction>
    </main>
  );
}

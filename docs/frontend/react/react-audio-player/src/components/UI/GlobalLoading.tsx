import { useScrollLock } from 'hooks/useScroll';

import styles from './GlobalLoading.module.scss';

export default function GlobalLoading() {
  useScrollLock();
  return (
    <div className={styles.loading}>
      <h1>Loading...</h1>
    </div>
  );
}

import NavBar from '@/components/nav/Navbar';
import styles from '@/styles/Home.module.css';
import { ReactNode } from 'react';

export default function NavLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <NavBar />
        {children}
      </div>
    </div>
  );
}

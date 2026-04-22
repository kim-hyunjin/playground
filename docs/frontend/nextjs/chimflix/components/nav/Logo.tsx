import Link from 'next/link';

import styles from './Logo.module.css';

const Logo = () => {
  return (
    (<Link href={'/'} className={styles.logoLink}>

      <div className={styles.logoWrapper}>CHIMFLIX</div>

    </Link>)
  );
};

export default Logo;

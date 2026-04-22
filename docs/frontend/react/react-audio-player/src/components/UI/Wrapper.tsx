import React from 'react';

import styles from './Wrapper.module.scss';

export default function Wrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <h1>{title}</h1>
      <main>{children}</main>
    </div>
  );
}

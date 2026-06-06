import useErrorStore from 'store/errorStore';

import styles from './ErrorPage.module.scss';

export default function ErrorPage() {
  const errMsg = useErrorStore((state) => state.errMsg);
  return (
    <main className={styles.errorPage}>
      <h1>{errMsg}</h1>
      <button
        className={styles.btn}
        onClick={() => {
          window.location.reload();
        }}
      >
        Refresh
      </button>
    </main>
  );
}

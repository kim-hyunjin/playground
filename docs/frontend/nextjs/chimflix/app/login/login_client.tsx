'use client';

import Logo from '@/components/nav/Logo';

import styles from '@/styles/Login.module.css';
import { ChangeEventHandler, MouseEventHandler, useCallback, useState } from 'react';
import { emailValidator } from '@/lib/validator';
import { useRouter } from 'next/navigation';

import { magic } from '@/lib/magic-client';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [userMsg, setUserMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleOnChangeEmail: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleLoginWithEmail: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const [isValid, errMsg] = emailValidator.validate(email);

    if (!isValid) {
      setUserMsg(errMsg);
      return;
    }

    if (!magic) {
      return;
    }

    try {
      setUserMsg('');
      setIsLoading(true);

      const didToken = await magic.auth.loginWithMagicLink({
        email,
      });
      if (!didToken) {
        throw Error('didToken not found');
      }
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${didToken}`,
        },
      });

      if (res.ok) {
        router.push('/');
      } else {
        throw Error();
      }
    } catch (error) {
      setIsLoading(false);
      setUserMsg('Something went wrong...');
      console.error('Something went wrong while logging in', error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Logo />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            className={styles.emailInput}
            type='text'
            placeholder='email address'
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button
            className={styles.loginBtn}
            onClick={handleLoginWithEmail}
            style={{ cursor: isLoading ? 'default' : 'pointer' }}
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';

import styles from './Navbar.module.css';

import Logo from './Logo';
import { MouseEventHandler, useCallback, useState, useEffect, ChangeEventHandler } from 'react';

import { magic } from '@/lib/magic-client';
import { useRouter } from 'next/navigation';
import { checkTokenExist, removeTokenCookie } from '@/lib/cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import useDebounceEffect from '@/hooks/useDebounceEffect';
import { globalSearchKeyword } from '@/state';

import { useAtom } from 'jotai';
import useGlobalSearch from '@/hooks/query/useGlobalSearch';

const NavBar = () => {
  const [sc, setSearchClick] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // fetch user name
    const getUserName = async () => {
      if (!magic) return null;
      try {
        const { email } = await magic.user.getMetadata();
        if (email) {
          setUsername(email);
        }
      } catch (err) {}
    };
    getUserName();

    // add scroll event
    const scrollEventHandler = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', scrollEventHandler);
    return () => {
      window.removeEventListener('scroll', scrollEventHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update globalSearchKeyword atom state
  const [_, setGlobalSearchKeyword] = useAtom(globalSearchKeyword);
  useDebounceEffect(() => {
    setGlobalSearchKeyword(searchKeyword);
  });
  const { data: searchResult } = useGlobalSearch();

  const handleLoginButtonClick = useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleSignout = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (!magic) return;
      try {
        await magic.user.logout();
        removeTokenCookie();
        router.push('/login');
      } catch (err) {
        router.push('/login');
      }
    },
    [router]
  );

  const handleShowDropdown: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    setShowUserMenu((prev) => !prev);
  }, []);

  const handleSearchInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);

  const handleSearchOverlayClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    setSearchClick(false);
    setSearchKeyword('');
  }, []);

  const isLoggedIn = checkTokenExist();

  return (
    <>
      <div className={scrollY === 0 ? styles.container : styles.container2}>
        <div className={styles.wrapper}>
          <div onClick={() => setSearchKeyword('')}>
            <Logo />
          </div>
          <div className={styles.navWrapper}>
            <ul className={styles.navItems}>
              {mounted && isLoggedIn && (
                <li className={styles.navItem}>
                  <Link href={'/browse/my-list'}>내가 찜한 컨텐츠</Link>
                </li>
              )}
            </ul>

            <nav className={styles.navContainer}>
              <motion.div
                animate={{ width: sc ? '25vw' : '1.2rem' }}
                className={sc ? styles.searchBoxActive : styles.searchBox}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => setSearchClick(true)}
                />
                <input
                  className={styles.searchInput}
                  placeholder={'제목'}
                  value={searchKeyword}
                  onChange={handleSearchInputChange}
                  style={{
                    display: sc ? 'block' : 'none',
                  }}
                />
              </motion.div>
              <motion.div
                animate={{ width: sc ? '90vw' : '1.2rem' }}
                className={sc ? styles.mobileSearchBoxActive : styles.mobileSearchBox}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => setSearchClick(true)}
                />
                <input
                  className={styles.searchInput}
                  placeholder={'제목'}
                  value={searchKeyword}
                  onChange={handleSearchInputChange}
                  style={{
                    display: sc ? 'block' : 'none',
                  }}
                />
              </motion.div>
              {mounted && isLoggedIn && (
                <button className={styles.usernameBtn} onClick={handleShowDropdown}>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#ffffff' }} />
                </button>
              )}
              {mounted && !isLoggedIn && (
                <button className={styles.navItem} onClick={handleLoginButtonClick}>
                  Login
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div
        className={styles.overlay}
        style={{
          display:
            (sc && searchKeyword === '') || (sc && (!searchResult || searchResult.length === 0))
              ? 'block'
              : 'none',
        }}
        onClick={handleSearchOverlayClick}
      ></div>
      <div
        className={styles.userMenuOverlay}
        style={{ display: showUserMenu ? 'block' : 'none' }}
        onClick={() => {
          setShowUserMenu(false);
        }}
      >
        <div className={styles.userMenuBox}>
          <div className={styles.userMenu} style={{ cursor: 'default' }}>
            {username}
          </div>
          <Link href={'/browse/my-list'} className={styles.userMenu}>
            내가 찜한 컨텐츠
          </Link>
          <a className={styles.userMenu} onClick={handleSignout}>
            로그아웃
          </a>
        </div>
      </div>
    </>
  );
};

export default NavBar;

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/NavBar.module.css"; // css module

export default function NavBar() {
    const router = useRouter(); // 현재 url 정보를 얻을 수 잇는 hook

    return (
        <>
            {/**랜덤한 className을 만들어준다. */}
            <nav className={styles.nav}>
                {/**Link컴포넌트를 사용해야 페이지를 다시 불러오지 않고, Single Page Application을 만들 수 있다. */}
                <Link href="/">
                    {/**렌더링 되는 tag는 a 태그이므로 className이나 style 등은 a태그에 적용하면 된다. */}
                    <a className={`${styles.link} ${router.pathname === "/" ? styles.active : ""}`}>
                        Home
                    </a>
                </Link>
                <Link href="/about">
                    {/**css module의 className을 여러 개 사용하기 위한 방법2 */}
                    <a
                        className={[
                            styles.link,
                            router.pathname === "/about" ? styles.active : "",
                        ].join(" ")}
                    >
                        About
                    </a>
                </Link>
            </nav>
        </>
    );
}

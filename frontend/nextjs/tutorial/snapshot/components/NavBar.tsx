import Link from "next/link";
import { useRouter } from "next/router";

export default function NavBar() {
    const router = useRouter();

    return (
        <>
            <nav>
                <Link href="/">
                    <a className={router.pathname === "/" ? "active" : ""}>Home</a>
                </Link>
                <Link href="/about">
                    <a className={router.pathname === "/about" ? "active" : ""}>About</a>
                </Link>
                {/** styled tsx에 선언한 스타일들은 범위가 이 컴포넌트에 한정된다.
                 * className을 따로 정의할 필요없이 html 태그에 스타일을 적용할 수 있다.
                 */}
                <style jsx>{`
                    nav {
                        background-color: tomato;
                    }
                    a {
                        text-decoration: none;
                    }
                    .active {
                        color: yellow;
                    }
                `}</style>
            </nav>
        </>
    );
}

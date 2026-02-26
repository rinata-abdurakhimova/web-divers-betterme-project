import Link from "next/link";
import styles from "./Header.module.scss";
import {FC} from "react";

export const Header: FC = () => {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.block__button}>
                Back to homepage
            </Link>
        </header>
    );
}
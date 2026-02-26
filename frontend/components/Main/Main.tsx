import Link from "next/link";
import styles from "./Main.module.scss";
import {FC} from "react";

export const Main: FC = () => {
    return (
        <main className={styles.block}>
            <h1 className={styles.block__title}>
                Welcome to WellnessCompany!
            </h1>

            <p className={styles.block__text}>
                You can order our wellness kit
            </p>

            <Link href="/order" className={styles.block__button}>
                Make an order
            </Link>
        </main>
    );
}
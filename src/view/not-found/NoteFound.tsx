import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import styles from "./not-found.module.scss";

export function NoteFound() {
  return (
    <div className={styles.wrap}>
      <Link href="/dashboard" className={styles.logo} aria-label="Prepify home">
        <Image
          src="/images/logo.svg"
          alt="Prepify"
          width={160}
          height={44}
          priority
        />
      </Link>

      <div className={styles.content}>
        <p className={styles.code} aria-hidden>
          <span>4</span>
          <span className={styles.zero}>!</span>
          <span>4</span>
        </p>
        <h1 className={styles.title}>Oops! You&apos;re lost.</h1>
        <p className={styles.subtitle}>
          The page you are looking for is not here.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

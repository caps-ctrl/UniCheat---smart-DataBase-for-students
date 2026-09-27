import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.screen} aria-busy="true" aria-live="polite">
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.orbOne} />
        <span className={styles.orbTwo} />
        <span className={styles.grid} />
      </div>

      <section className={styles.loader} role="status">
        <div className={styles.markWrap} aria-hidden="true">
          <span className={styles.orbit} />
          <span className={styles.orbitDot} />

          <div className={styles.mark}>
            <svg
              viewBox="0 0 64 64"
              className={styles.markIcon}
              focusable="false"
            >
              <path
                d="M10 21.5 32 11l22 10.5L32 32 10 21.5Z"
                fill="currentColor"
              />
              <path
                d="M18 27.5v12.8c0 2.8 6.3 7.7 14 7.7s14-4.9 14-7.7V27.5L32 34l-14-6.5Z"
                fill="currentColor"
                opacity=".72"
              />
              <path
                d="M53.5 24v13"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        <div className={styles.brand} aria-label="uniCheat">
          <span>uni</span>Cheat
        </div>

        <p className={styles.message}>Przygotowujemy Twoją przestrzeń do nauki</p>

        <div className={styles.progress} aria-hidden="true">
          <span />
        </div>

        <div className={styles.steps} aria-hidden="true">
          <span className={styles.stepActive} />
          <span />
          <span />
        </div>

        <span className={styles.srOnly}>Trwa ładowanie strony.</span>
      </section>
    </main>
  );
}

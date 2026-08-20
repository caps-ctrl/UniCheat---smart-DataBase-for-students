"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, type AuthState } from "./actions";
import type { AuthField } from "./schema";
import styles from "./AuthPage.module.css";

type AuthPageProps = {
  mode: "login" | "register";
};

function FieldError({
  errors,
  field,
}: {
  errors: AuthState["errors"];
  values?: {
    email?: string;
    userName?: string;
  };
  field: AuthField;
}) {
  const message = errors?.[field]?.[0];

  if (!message) {
    return null;
  }

  return (
    <span className={styles.fieldError} id={`${field}-error`}>
      {message}
    </span>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login";
  const action = isLogin ? login : register;
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    action,
    {},
  );
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.formSide}>
          <Link
            href="/"
            className={styles.brand}
            aria-label="uniCheat — strona główna"
          >
            <span className={styles.brandMark}>uC</span>
            <span>uniCheat</span>
          </Link>

          <div className={styles.formWrap}>
            <p className={styles.eyebrow}>
              {isLogin ? "Witaj ponownie" : "Dołącz do nas"}
            </p>
            <h1 className={styles.title}>
              {isLogin ? "Zaloguj się do konta" : "Załóż konto studenta"}
            </h1>
            <p className={styles.subtitle}>
              {isLogin
                ? "Twoje materiały, zapisane przedmioty i społeczność czekają w jednym miejscu."
                : "Zyskaj dostęp do materiałów, opinii i wiedzy tworzonej przez studentów ZUT."}
            </p>

            <form className={styles.form} action={formAction} noValidate>
              {!isLogin && (
                <div>
                  <label className={styles.field}>
                    <span className={styles.label}>Nazwa użytkownika</span>
                    <input
                      className={`${styles.input} ${state.errors?.userName ? styles.inputError : ""}`}
                      name="userName"
                      type="text"
                      autoComplete="username"
                      placeholder="nazwa uzytkownika"
                      aria-invalid={Boolean(state.errors?.userName)}
                      aria-describedby={
                        state.errors?.userName ? "userName-error" : undefined
                      }
                    />
                    <FieldError errors={state.errors} field="userName" />
                  </label>
                  <div className={styles.fieldRow}>
                    <label className={styles.field}>
                      <span className={styles.label}>Imię</span>
                      <input
                        className={`${styles.input} ${state.errors?.firstName ? styles.inputError : ""}`}
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Jan"
                        aria-invalid={Boolean(state.errors?.firstName)}
                        aria-describedby={
                          state.errors?.firstName
                            ? "firstName-error"
                            : undefined
                        }
                      />
                      <FieldError errors={state.errors} field="firstName" />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>Nazwisko</span>
                      <input
                        className={`${styles.input} ${state.errors?.lastName ? styles.inputError : ""}`}
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Kowalski"
                        aria-invalid={Boolean(state.errors?.lastName)}
                        aria-describedby={
                          state.errors?.lastName ? "lastName-error" : undefined
                        }
                      />
                      <FieldError errors={state.errors} field="lastName" />
                    </label>
                  </div>
                </div>
              )}

              <label className={styles.field}>
                <span className={styles.label}>Adres e-mail</span>
                <input
                  className={`${styles.input} ${state.errors?.email ? styles.inputError : ""}`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@zut.edu.pl"
                  aria-invalid={Boolean(state.errors?.email)}
                  aria-describedby={
                    state.errors?.email ? "email-error" : undefined
                  }
                />
                <FieldError errors={state.errors} field="email" />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Hasło</span>
                <input
                  className={`${styles.input} ${state.errors?.password ? styles.inputError : ""}`}
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder={
                    isLogin ? "Wpisz swoje hasło" : "Minimum 8 znaków"
                  }
                  aria-invalid={Boolean(state.errors?.password)}
                  aria-describedby={
                    state.errors?.password ? "password-error" : undefined
                  }
                />
                <FieldError errors={state.errors} field="password" />
              </label>

              {!isLogin && (
                <label className={styles.field}>
                  <span className={styles.label}>Powtórz hasło</span>
                  <input
                    className={`${styles.input} ${state.errors?.passwordConfirmation ? styles.inputError : ""}`}
                    name="passwordConfirmation"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Wpisz hasło ponownie"
                    aria-invalid={Boolean(state.errors?.passwordConfirmation)}
                    aria-describedby={
                      state.errors?.passwordConfirmation
                        ? "passwordConfirmation-error"
                        : undefined
                    }
                  />
                  <FieldError
                    errors={state.errors}
                    field="passwordConfirmation"
                  />
                </label>
              )}

              <div className={styles.options}>
                <label className={styles.checkboxLabel}>
                  <input
                    className={styles.checkbox}
                    name={isLogin ? "rememberMe" : "terms"}
                    type="checkbox"
                    aria-invalid={Boolean(!isLogin && state.errors?.terms)}
                    aria-describedby={
                      !isLogin && state.errors?.terms
                        ? "terms-error"
                        : undefined
                    }
                  />
                  <span>
                    {isLogin ? (
                      "Zapamiętaj mnie"
                    ) : (
                      <>
                        Akceptuję{" "}
                        <Link className={styles.textLink} href="#">
                          regulamin
                        </Link>{" "}
                        i politykę prywatności
                      </>
                    )}
                  </span>
                </label>
                {isLogin && (
                  <Link className={styles.textLink} href="#">
                    Nie pamiętasz hasła?
                  </Link>
                )}
              </div>
              {!isLogin && <FieldError errors={state.errors} field="terms" />}

              {state.message && (
                <p
                  className={
                    state.success ? styles.successMessage : styles.errorMessage
                  }
                  role={state.success ? "status" : "alert"}
                >
                  {state.message}
                </p>
              )}

              <button
                className={styles.submit}
                type="submit"
                disabled={isPending}
              >
                {isPending
                  ? "Proszę czekać…"
                  : isLogin
                    ? "Zaloguj się"
                    : "Utwórz konto"}
              </button>
            </form>

            <p className={styles.switchText}>
              {isLogin ? "Nie masz jeszcze konta? " : "Masz już konto? "}
              <Link
                className={styles.textLink}
                href={isLogin ? "/register" : "/login"}
              >
                {isLogin ? "Zarejestruj się" : "Zaloguj się"}
              </Link>
            </p>
          </div>
        </section>

        <aside className={styles.visualSide} aria-label="O uniCheat">
          <span className={styles.decorDot} aria-hidden="true" />
          <div className={styles.visualContent}>
            <span className={styles.visualBadge}>
              Społeczność studentów ZUT
            </span>
            <h2 className={styles.visualTitle}>Ucz się sprytniej. Razem.</h2>
            <p className={styles.visualText}>
              Notatki, materiały i praktyczne wskazówki od osób, które zaliczały
              te same przedmioty co Ty.
            </p>
            <div className={styles.stats} aria-label="Najważniejsze korzyści">
              <div className={styles.stat}>
                <strong>24/7</strong>
                <span>Dostęp do wiedzy</span>
              </div>
              <div className={styles.stat}>
                <strong>ZUT</strong>
                <span>Jedna społeczność</span>
              </div>
              <div className={styles.stat}>
                <strong>100%</strong>
                <span>Studencki klimat</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Adres e-mail jest wymagany.")
  .max(254, "Adres e-mail jest zbyt długi.")
  .email("Wpisz poprawny adres e-mail.")
  .transform((value) => value.toLowerCase());

const userName = z
  .string()
  .min(1, "Nazwa uzytkownika jest wymagana")
  .max(30, "Nazwa uzytkownika jest zbyt dluga");

const password = z
  .string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków.")
  .max(72, "Hasło może mieć maksymalnie 72 znaki.");

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} musi mieć co najmniej 2 znaki.`)
    .max(50, `${label} może mieć maksymalnie 50 znaków.`)
    .regex(
      /^[\p{L}\p{M}' -]+$/u,
      `${label} może zawierać tylko litery, spacje, apostrof i myślnik.`,
    );

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Hasło jest wymagane."),
  captchaToken: z.string().min(1, "Weryfikacja reCAPTCHA jest wymagana")
});

export const registerSchema = z
  .object({
    userName,
    firstName: name("Imię"),
    lastName: name("Nazwisko"),
    email,
    password,
    passwordConfirmation: z.string().min(1, "Powtórz hasło."),
    terms: z.boolean().refine((accepted) => accepted, {
      message: "Zaakceptuj regulamin i politykę prywatności.",
    }),
    captchaToken: z.string().min(1, "Weryfikacja reCAPTCHA jest wymagana."),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      message: "Podane hasła nie są takie same.",
      path: ["passwordConfirmation"],
    },
  );

export const authFieldNames = [
  "userName",
  "firstName",
  "lastName",
  "email",
  "password",
  "passwordConfirmation",
  "terms",
  "captchaToken"
] as const;

export type AuthField = (typeof authFieldNames)[number];
export type AuthFieldErrors = Partial<Record<AuthField, string[]>>;

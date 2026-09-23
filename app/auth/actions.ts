"use server";
import { authRateLimit } from '@/lib/redis/rateLimit';
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, type AuthFieldErrors } from "./schema";
import { getClientIp } from "@/lib/utils";

export type AuthState = {
  errors?: AuthFieldErrors;
  message?: string;
  success?: boolean;
};

function fieldValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function validationFailure(errors: AuthFieldErrors): AuthState {
  return {
    errors,
    message: "Popraw zaznaczone pola.",
  };
}

function authErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Nieprawidłowy adres e-mail lub hasło.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Najpierw potwierdź adres e-mail, korzystając z wysłanej wiadomości.";
  }
  if (normalized.includes("user already registered")) {
    return "Konto z tym adresem e-mail już istnieje.";
  }
  if (normalized.includes("password")) {
    return "Hasło nie spełnia wymagań bezpieczeństwa.";
  }
  if (normalized.includes("rate limit")) {
    return "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.";
  }
  if (normalized.includes("23505")) {
    return "Nazwa uytkownika juz jest zajeta.";
  }

  return "Nie udało się wykonać operacji. Spróbuj ponownie.";
}

export async function login(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const ip = await getClientIp();

  if (ip) {
    const { success } = await authRateLimit.limit(ip);

    if (!success) {
      return {
        message: "Zbyt wiele prób logowania. Odczekaj chwilę i spróbuj ponownie.",
      };
    }
  }




  const result = loginSchema.safeParse({
    email: fieldValue(formData, "email"),
    password: fieldValue(formData, "password"),
    captchaToken: fieldValue(formData, "captchaToken")
  });

  if (!result.success) {
    return validationFailure(result.error.flatten().fieldErrors);
  }
  const { email, password, captchaToken } = result.data

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });

  if (error) {
    return { message: error.message };
  }

  redirect("/profile");
}

export async function register(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {

  const ip = await getClientIp();
  console.log(ip)

  if (ip) {
    const { success } = await authRateLimit.limit(ip)

    if (!success) {
      return {
        message: "Zbyt wiele prób logowania. Odczekaj chwilę i spróbuj ponownie.",
      };
    }
  }

  const result = registerSchema.safeParse({
    userName: fieldValue(formData, "userName"),
    firstName: fieldValue(formData, "firstName"),
    lastName: fieldValue(formData, "lastName"),
    email: fieldValue(formData, "email"),
    password: fieldValue(formData, "password"),
    passwordConfirmation: fieldValue(formData, "passwordConfirmation"),
    terms: formData.get("terms") === "on",
    captchaToken: fieldValue(formData, "captchaToken"),
  });

  if (!result.success) {
    return validationFailure(result.error.flatten().fieldErrors);
  }


  const { userName, firstName, lastName, email, password, captchaToken } = result.data;


  const requestHeaders = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    requestHeaders.get("origin") ??
    "http://localhost:3000";
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        username: `${userName}`,
      },
      emailRedirectTo: `${origin}/auth/confirm?next=/profile`,
      captchaToken: captchaToken,
    },
  });

  if (error) {


    console.error(error.message)


    return {
      message: error.message,

    };


  }

  if (data.session) {
    redirect("/profile");
  }

  return {
    success: true,
    message:
      "Konto zostało utworzone. Sprawdź pocztę i potwierdź adres e-mail.",
  };
}

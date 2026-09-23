import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { headers } from "next/headers";

export async function getClientIp() {

  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");

  if (!forwardedFor) {

    return null;

  }

  return forwardedFor.split(",")[0].trim();

}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



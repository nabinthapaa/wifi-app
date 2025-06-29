import { twMerge } from "tw-merge";
import { ClassValue, clsx } from "clsx";

export function cn(...className: ClassValue[]) {
  return twMerge(clsx(className));
}

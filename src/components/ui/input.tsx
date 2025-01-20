import * as React from "react";
import { cn } from "@/assets/styles/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string | number | readonly string[] | null;
  onChange?: (event: any) => void;
  isMask?: boolean;
  isPhone?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, isMask, isPhone, ...props }, ref) => {
    
    const formatPhone = (input: string) => {
      const formatted = input
        .replace(/^0/, "") // Remove '0' di depan
        .replace(/\D/g, "") // Filter non-number char
        .replace(/(\d{3})(\d{4})(\d{0,5})/, (_, p1, p2, p3) =>
          `${p1} ${p2}${p3 ? ` ${p3}` : ""}`
        );
      return formatted.substring(0, 15); // Limit length to 15 characters
    };

    const removePhoneFormat = (input: string) => {
      const formatted = input.replace(/\s/g, "");
      return formatted ? "0" + formatted : "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      if (isMask) {
        inputValue = inputValue.replace(/\D/g, "");
      } else if (isPhone) {
        const formatted = formatPhone(inputValue);
        onChange?.(removePhoneFormat(formatted));
      } else {
        onChange?.(e);
      }
    };

    const displayValue = isPhone && typeof value === "string" ? formatPhone(value) : value;

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={displayValue as string | number | readonly string[] | undefined}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

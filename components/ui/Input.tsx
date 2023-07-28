import { forwardRef } from "preact/compat";
import { cn } from "@/lib/utils.ts";

const Input = forwardRef<
    HTMLInputElement,
    React.HTMLAttributes<HTMLInputElement>
>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-[color:var(--input)] bg-[color:var(--background)] px-3 py-2 text-sm ring-offset-[color:var(--background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[color:var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = "Input";

export { Input };

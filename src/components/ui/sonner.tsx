import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // richColors makes the icons naturally colored (green for success, red for error)
      richColors 
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:font-sans",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:mt-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          // Adding refined success and error states
          success: "group-[.toast]:bg-emerald-50 group-[.toast]:text-emerald-900 group-[.toast]:border-emerald-200 dark:group-[.toast]:bg-emerald-950/30 dark:group-[.toast]:text-emerald-400 dark:group-[.toast]:border-emerald-500/20",
          error: "group-[.toast]:bg-red-50 group-[.toast]:text-red-900 group-[.toast]:border-red-200 dark:group-[.toast]:bg-red-950/30 dark:group-[.toast]:text-red-400 dark:group-[.toast]:border-red-500/20",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
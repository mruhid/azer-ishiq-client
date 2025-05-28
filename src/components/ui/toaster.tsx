"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        duration = 5000,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            duration={duration}
            className="relative overflow-hidden  rounded-lg "
          >
            {/* Progress bar at top */}
            <div
              className="animate-toast-progress absolute left-0 top-0 h-1 bg-[#1e3a8a]"
              style={{ animationDuration: `${duration}ms` }}
            />
            <div className="grid gap-1 pt-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

"use client";

import { X } from "lucide-react";
import { toast, Toaster, ToastBar, type ToasterProps } from "react-hot-toast";

export default function AppToaster({
  position = "bottom-center",
}: {
  position?: ToasterProps["position"];
}) {
  return (
    <Toaster containerClassName="cursor-pointer" position={position}>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== "loading" && (
                <X
                  size={24}
                  className="ml-2 cursor-pointer"
                  aria-label="Dismiss notification"
                  onClick={() => toast.dismiss(t.id)}
                />
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

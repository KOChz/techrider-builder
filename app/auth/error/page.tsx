import { ErrorContent } from "@/components/error-content/error-content";
import { Suspense } from "react";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}

import { isDevelopment } from "@/lib/env";
import { isMockAiEnabled } from "@/lib/ai/generate-report";
import { isMockPaymentsEnabled } from "@/lib/payments";

export function DevBanner() {
  if (!isDevelopment) return null;

  const mockAi = isMockAiEnabled();
  const mockPay = isMockPaymentsEnabled();

  if (!mockAi && !mockPay) return null;

  return (
    <div className="border-b border-amber-500/15 bg-amber-500/[0.06] px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-amber-300/90">
      Development · {mockAi && "Mock AI"}{mockAi && mockPay && " · "}{mockPay && "Mock Payments"}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

/**
 * Background worker endpoint: processes queued lesson-writing jobs.
 * Called on a schedule so content keeps generating with nobody watching.
 */
export const Route = createFileRoute("/api/public/ai-jobs-tick")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await authenticateCronRequest(request);
        if (denied) return denied;
        const { processAiJobs } = await import("@/lib/ai-jobs.server");
        const result = await processAiJobs(3);
        return Response.json(result);
      },
    },
  },
});

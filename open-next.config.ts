import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// This marketing site does not use ISR or on-demand revalidation, so no R2,
// queue or database bindings are required.
export default defineCloudflareConfig();

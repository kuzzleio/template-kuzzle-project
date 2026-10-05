import { BadRequestError } from "kuzzle";
import { createBrowserLogsController } from "kuzzle-logger/kuzzle";

import { Module } from "../shared/Module.js";

/**
 * Namespaces of the frontend logger (`kuzzle-logger/browser`): its logger and
 * the children capturing the uncaught errors (`global`) and the Vue errors (`vue`).
 * Add the namespaces your frontend logs with: the others are still logged, under
 * `browser`, with their namespace in `clientNamespace`.
 */
export const BROWSER_LOG_NAMESPACES = ["web", "web:global", "web:vue"];

export class BrowserLogsModule extends Module {
  register() {
    /**
     * Registers `browser-logs:push` (`POST /_/browser-logs/_push`): the batches
     * sent by the frontend are validated, sanitized, then written with the
     * application logger under the `browser` namespace.
     */
    this.app.controller.register(
      "browser-logs",
      createBrowserLogsController(this.app.log, {
        allowedNamespaces: BROWSER_LOG_NAMESPACES,
        // Without it, an invalid batch gets a 500 instead of a 400, and the browser retries it
        badRequest: (message) => new BadRequestError(message),
      }),
    );
  }

  async init() {
    // Nothing to do
  }
}

import { BadRequestError, KuzzleRequest } from "kuzzle";

import { MyApplication } from "../../lib/MyApplication.js";
import { BrowserLogsModule } from "../../lib/modules/browserLogs/browserLogsModule.js";

function fakeApp() {
  const logger = {
    child: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    info: vi.fn(),
    trace: vi.fn(),
    warn: vi.fn(),
  };
  logger.child.mockReturnValue(logger);

  const app = { controller: { register: vi.fn() }, log: logger };

  new BrowserLogsModule(app as unknown as MyApplication).register();

  const [[name, definition]] = app.controller.register.mock.calls;

  return { definition, logger, name };
}

const request = (body: unknown) =>
  ({
    context: { connection: { misc: { headers: {} } } },
    getKuid: () => "user-1",
    input: { body },
  }) as unknown as KuzzleRequest;

describe("BrowserLogsModule", () => {
  it("registers browser-logs:push on POST /_/browser-logs/_push", () => {
    const { definition, name } = fakeApp();

    expect(name).toBe("browser-logs");
    expect(definition.actions.push.http).toEqual([
      expect.objectContaining({ path: "browser-logs/_push", verb: "post" }),
    ]);
  });

  it("writes the entries with the application logger", async () => {
    const { definition, logger } = fakeApp();

    const result = await definition.actions.push.handler(
      request({
        entries: [
          { level: "error", msg: "Uncaught error", namespace: "web:global" },
        ],
        version: 1,
      }),
    );

    expect(result).toEqual({ accepted: 1, rejected: [] });
    expect(logger.child).toHaveBeenCalledWith("browser");
    expect(logger.child).toHaveBeenCalledWith("web:global");
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ source: "browser", userId: "user-1" }),
      "Uncaught error",
    );
  });

  it("rejects an invalid batch with a 400", async () => {
    const { definition } = fakeApp();

    await expect(
      definition.actions.push.handler(request({ entries: "nope", version: 1 })),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});

import { MyApplication, MyApplicationConfig } from "../../lib/MyApplication.js";
import { Plugin } from "kuzzle";
import { appSettings } from "./utils.js";

// We need to supress the singleton behavior of the Backend class for unit testing purpose
Reflect.defineProperty(globalThis, "kuzzle", {
  get() {
    return {
      id: "toto",
    };
  },
});

Reflect.defineProperty(globalThis, "app", {
  value: {},
  writable: true,
});

describe("MyApplication", () => {
  const instance = new MyApplication(appSettings as MyApplicationConfig);
  describe("constructor", () => {
    it("should instantiate a MyApplication", () => {
      expect(instance.plugin.get("prometheus")).toBeInstanceOf(Plugin);
    });
  });
});

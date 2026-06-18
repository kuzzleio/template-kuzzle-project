import { BadRequestError } from "kuzzle";

import { BaseManager } from "../shared/BaseManager.js";

export class ExampleManager extends BaseManager {
  async sayHello(name: string): Promise<string> {
    if (!name) {
      throw new BadRequestError("name is not defined");
    }

    return name;
  }
}

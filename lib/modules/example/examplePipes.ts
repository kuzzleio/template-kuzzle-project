import { MyApplication } from "#MyApplication";
import { KuzzleRequest } from "kuzzle";

export class ExamplePipes {
  private readonly app: MyApplication;

  constructor(app: MyApplication) {
    this.app = app;
  }

  async runBeforeWithPipe(request: KuzzleRequest) {
    /**
     * A pipe can modify the request when ran before an action
     * Request must be returned, else it will stay in a pending state
     * See: https://docs.kuzzle.io/core/2/guides/develop-on-kuzzle/event-system/
     */
    this.app.log.info(
      "I will run before all event in example controller in the sync and will return the request",
    );

    request.addDeprecation(
      "1.0.0",
      "This function is deprecated, please use something else",
    );

    return request;
  }

  async runBeforeWithHook() {
    /**
     * A hook is asynchronous and can not modify anything
     * You can see it more like a way of notifying that something occured
     * See: https://docs.kuzzle.io/core/2/guides/develop-on-kuzzle/event-system/
     */
    this.app.log.info(
      "I will run before all event in example controller in async",
    );
  }
}

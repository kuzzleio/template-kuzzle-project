import { Module } from "../shared/Module.js";
import { ExampleController } from "./exampleController.js";
import { ExamplePipes } from "./examplePipes.js";

export class ExampleModule extends Module {
  register() {
    /**
     * This function is launch before Kuzzle has been started
     * From here you can create controller and attach pipes/hooks
     */
    const controller = new ExampleController(this.app);
    const pipes = new ExamplePipes(this.app);

    this.app.controller.use(controller);

    this.app.pipe.register(
      "example:before*",
      pipes.runBeforeWithPipe.bind(this),
    );
    this.app.hook.register(
      "example:before*",
      pipes.runBeforeWithHook.bind(this),
    );
  }

  async init() {
    /**
     * This function is launch after Kuzzle has been started
     * From here you can access the sdk and run query.
     */
  }
}

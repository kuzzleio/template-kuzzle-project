import { Module } from "../../Module";
import ExampleController from "./controller";

export default class ExampleModule extends Module {
  register(): void {
    // Register pipe
    // Register scheduled task

    this.app.controller.use(new ExampleController(this.app));
  }

  async init(): Promise<void> {
    // Do something after Kuzzle started
  }
}

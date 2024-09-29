import { Controller, Backend } from "kuzzle";

import ExampleService from "./service";

export default class ExampleController extends Controller {
  private exampleService: ExampleService;

  constructor(app: Backend) {
    super(app);

    this.name = "example";
    this.exampleService = new ExampleService(app);

    this.definition = {
      actions: {
        sayHello: {
          handler: this.sayHello,
        },
      },
    };
  }


  async sayHello() {
    return this.exampleService.sayHello();
  }
}

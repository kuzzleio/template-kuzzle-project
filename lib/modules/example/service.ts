import { Backend, EmbeddedSDK } from 'kuzzle';

export default class ExampleService {
  private app: Backend;

  protected get sdk(): EmbeddedSDK {
    return this.app.sdk;
  }

  constructor(app: Backend) {
    this.app = app;
  }

  async sayHello() {
    return 'Hello World';
  }
}

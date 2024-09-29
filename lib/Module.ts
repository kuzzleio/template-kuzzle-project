import { Backend } from 'kuzzle';

export abstract class Module<App extends Backend = Backend> {
  constructor(protected readonly app: App) {}

  protected get sdk() {
    return this.app.sdk;
  }

  abstract register(): void;

  /**
   * This method can be overridden to implement module initialization
   */
  async init(): Promise<void> {
    // Nothing to do
  }
}
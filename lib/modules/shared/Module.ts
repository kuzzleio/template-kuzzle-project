import { MyApplication } from "#MyApplication";

export abstract class Module<App extends MyApplication = MyApplication> {
  constructor(protected readonly app: App) {}

  protected get sdk() {
    return this.app.sdk;
  }

  /**
   * This method can be overridden to implement module initialization
   */

  abstract register(): void;

  abstract init(): Promise<void>;
}

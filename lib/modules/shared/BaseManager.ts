import { EmbeddedSDK } from "kuzzle";

import { MyApplication } from "../../MyApplication.js";

export class BaseManager {
  public app: MyApplication;

  constructor(app: MyApplication) {
    this.app = app;
  }

  get sdk(): EmbeddedSDK {
    return this.app.sdk;
  }
}

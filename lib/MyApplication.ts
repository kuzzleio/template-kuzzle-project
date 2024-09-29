import { Backend } from "kuzzle";
import { PrometheusPlugin } from "kuzzle-plugin-prometheus";

import { Module } from "./Module";
import ExampleModule from "./modules/example/module";

export type MyApplicationConfig = {
  someValue: string;

  another: {
    value: number;
  };
};

export class MyApplication extends Backend {
  private readonly modules: Module[] = [];
  public configuration: MyApplicationConfig;
  private prometheusPlugin = new PrometheusPlugin();

  get appConfig() {
    return this.config.content.application as MyApplicationConfig;
  }

  constructor(config?: MyApplicationConfig) {
    super("my-application");
    this.initConfig(config);
    this.initPlugins();
    this.initModules();

    for (const module of this.modules) {
      module.register();
    }
  }

  initConfig(config?: MyApplicationConfig) {
    if (config) {
      this.configuration = config;
    } else {
      this.configuration = this.config.content
        .application as MyApplicationConfig;
    }
  }

  initPlugins() {
    this.plugin.use(this.prometheusPlugin);
  }

  initModules() {
    this.modules.push(new ExampleModule(this));
  }

  async start() {
    await super.start();

    for (const module of this.modules) {
      await module.init();
    }

    this.log.info("Application started");
  }
}

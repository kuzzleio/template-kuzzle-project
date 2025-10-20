import { Backend } from "kuzzle";
import { PrometheusPlugin } from "kuzzle-plugin-prometheus";

import { Module } from "#/modules/shared/Module";
import { ExampleModule } from "#modules/example/exampleModule";

export type MyApplicationConfig = {
  someValue: string;

  another: {
    value: number;
  };
};

export class MyApplication extends Backend {
  public configuration: MyApplicationConfig;
  private readonly modules: Module[] = [];
  private prometheusPlugin = new PrometheusPlugin();

  get appConfig() {
    return this.config.content.application as MyApplicationConfig;
  }

  constructor(config?: MyApplicationConfig) {
    super("my-application");

    this.initConfig(config);
    this.regesterPlugins();
    this.registerModules();
  }

  initConfig(config: MyApplicationConfig) {
    if (config) {
      this.configuration = config;
    } else {
      this.configuration = this.config.content
        .application as MyApplicationConfig;
    }
  }

  registerModules() {
    this.modules.push(new ExampleModule(this));

    for (const module of this.modules) {
      module.register();
    }
  }

  regesterPlugins() {
    this.plugin.use(this.prometheusPlugin);
  }

  async start() {
    await super.start();

    this.log.info("Application started");

    for (const module of this.modules) {
      await module.init();
    }
  }
}

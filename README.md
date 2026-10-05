<p align="center">
  <img src="https://user-images.githubusercontent.com/7868838/103797784-32337580-5049-11eb-8917-3fcf4487644c.png"/>
</p>
<p align="center">
  <img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/kuzzleio/template-kuzzle-project/stable">
  <a href="https://github.com/kuzzleio/kuzzle/blob/master/LICENSE">
    <img alt="undefined" src="https://img.shields.io/github/license/kuzzleio/kuzzle.svg?style=flat">
  </a>
</p>

## Why Kuzzle ?

Kuzzle is a [generic backend](https://docs.kuzzle.io/core/2/guides/introduction/general-purpose-backend/) offering **the basic building blocks common to every application**.

Rather than developing the same standard features over and over again each time you create a new application, Kuzzle proposes them off the shelf, allowing you to focus on building **high-level, high-value business functionalities**.

Kuzzle enables you to build modern web applications and complex IoT networks in no time.

* **API First**: use a standardised multi-protocol API.
* **Persisted Data**: store your data and perform advanced searches on it.
* **Realtime Notifications**: use the pub/sub system or subscribe to database notifications.
* **User Management**: login, logout and security rules are no more a burden.
* **Extensible**: develop advanced business feature directly with the integrated framework.
* **Client SDKs**: use our SDKs to accelerate the frontend development.

Learn how Kuzzle will accelerate your developments :point_right: https://docs.kuzzle.io/core/2/guides/introduction/what-is-kuzzle/

## Kuzzle in production

Kuzzle is production-proof, and can be [deployed anywhere](https://kuzzle.io/products/by-features/on-premises/).

With Kuzzle, it is possible to deploy applications that can serve tens of thousands of users with very good performances.

Check out our [support plans](https://kuzzle.io/pricing/).

## Requirements

 - Node.js `>= 20 < 25` — the CI and the Docker images use **24**
 - npm (11.16 or later to regenerate `package-lock.json`, see [Browser logs](#browser-logs))
 - Docker with the Compose plugin

## Install and run

Dependencies are installed on your machine and shared with the container through a volume, so install them first:

```bash
npm install
docker compose up -d
```

Compose starts three services — `kuzzle` (the app, via `npm run dev`), `redis` and `elasticsearch` — and Kuzzle is then reachable on http://localhost:7512.

`npm run dev` runs `tsx watch app.ts`: it executes the TypeScript sources directly and restarts on change. It never writes to `dist/`, so there is nothing to build for the dev loop.

## Build

The project is compiled as native ESM and the emitted JavaScript keeps `.js` extensions on internal imports.

```bash
npm run build      # tsc --build tsconfig.build.json -> dist/app.js + dist/lib/
```

Two TypeScript configs are used on purpose:

| File | Used by | Scope |
| --- | --- | --- |
| `tsconfig.json` | your editor, `npm run test:types` | `app.ts`, `lib/`, `tests/`, `vitest.config.ts` |
| `tsconfig.build.json` | `npm run build`, the `Dockerfile` | `app.ts`, `lib/` only — tests stay out of the production image |

## Checks

```bash
npm run lint         # eslint, driven by eslint-plugin-kuzzle
npm run test:types   # tsc --noEmit, sources and tests
npm test             # vitest
```

> The lint toolchain is version-locked: `eslint-plugin-kuzzle@0.0.15` requires `eslint >= 8.50 < 9` and `typescript >= 5.2 < 5.5`. Bumping TypeScript past 5.4 requires migrating to the plugin's `eslint-9` release and a flat `eslint.config.js`.

## Production image

```bash
docker build --build-arg "KUZZLE_ENV=local" -t my-kuzzle-app .
```

`KUZZLE_ENV` (`local` | `main`) selects which `environments/<env>/kuzzlerc` is embedded as `/var/app/.kuzzlerc`. See the [configuration guide](https://docs.kuzzle.io/core/2/guides/advanced/configuration/).

## Use the framework

`app.ts` only instantiates and starts `MyApplication` (`lib/MyApplication.ts`), a `Backend` subclass. Business code is organised in **modules**, not registered inline.

```
lib/
├── MyApplication.ts              # Backend subclass — wire new modules in registerModules()
├── modules/
│   ├── shared/                   # Module + BaseManager base classes
│   ├── browserLogs/              # receives the frontend logs (browser-logs:push)
│   └── example/
│       ├── exampleModule.ts      # register() before start, init() after start
│       ├── exampleController.ts  # API surface, declared with decorators
│       ├── exampleManager.ts     # business logic
│       └── examplePipes.ts       # pipes and hooks
└── utils/decorators/             # @ApiController / @ApiAction / @ApiRoute
```

A controller declares its actions and their HTTP routes through decorators:

```ts
@ApiController("example", { routePrefix: "example" })
export class ExampleController extends Controller {
  public exampleManager = new ExampleManager(global.app as MyApplication);

  @ApiAction("sayHello")
  @ApiRoute({ verb: "get", path: "/_hello", openapi: { /* ... */ } })
  async sayHello(request: KuzzleRequest): Promise<string> {
    return this.exampleManager.sayHello(request.getString("name"));
  }
}
```

`routePrefix` is prepended to each declared `path`, and Kuzzle serves application routes under `/_/`. The example above is reachable three ways:

```bash
curl "http://localhost:7512/_/example/_hello?name=Yagmur"
curl -X POST http://localhost:7512/_query -H 'Content-Type: application/json' \
  -d '{"controller":"example","action":"sayHello","name":"Yagmur"}'
npx kourou example:sayHello --arg name=Yagmur
```

To add a module: create `lib/modules/<name>/` on the model of `example/`, then push it in `MyApplication.registerModules()`.

See also the [API Controllers guide](https://docs.kuzzle.io/core/2/guides/develop-on-kuzzle/api-controllers).

### Browser logs

`BrowserLogsModule` (`lib/modules/browserLogs/`) registers the `browser-logs:push` action (`POST /_/browser-logs/_push`) of [kuzzle-logger](https://docs.kuzzle.io/modules/logger/1/guides/browser-logs-ingestion/). A frontend using `kuzzle-logger/browser` sends its logs and uncaught errors there, and the application writes them with its own logger, under the `browser` namespace and with `source: "browser"`, next to the backend logs.

```bash
npx kourou browser-logs:push --body '{"version":1,"entries":[{"level":"error","msg":"Browser logging test","namespace":"web"}]}'
```

- **Rights:** grant the action to the roles of the frontend users (and to `anonymous` to receive the errors raised before login, see [Anonymous users](https://docs.kuzzle.io/modules/logger/1/guides/browser-logs-ingestion/#anonymous-users)):
  ```json
  { "controllers": { "browser-logs": { "actions": { "push": true } } } }
  ```
- **Namespaces:** only the namespaces listed in `BROWSER_LOG_NAMESPACES` get their own child logger (`web`, `web:global`, `web:vue` by default). Add the ones your frontend uses.
- **Frontend:** see [Set up browser logging](https://docs.kuzzle.io/modules/logger/1/guides/browser-logging-setup/).

> Kuzzle 2.59 and earlier install their own `kuzzle-logger` 1.4 for `app.log`. The `overrides` entry of `package.json` keeps a single, recent version: when you change dependencies, regenerate `package-lock.json` with npm 11.16 or later (`npx npm@11.16.0 install`), since some npm versions (11.7, 11.13) ignore `overrides` when they resolve the tree, and check that it holds a single `node_modules/kuzzle-logger`.

Learn how to [Write an Application](https://docs.kuzzle.io/core/2/guides/getting-started/write-application/).

### Useful links

* [Getting Started with Kuzzle](https://docs.kuzzle.io/core/2/guides/getting-started/run-kuzzle/)
* [API](https://docs.kuzzle.io/core/2/guides/main-concepts/api/)
* [Data Storage](https://docs.kuzzle.io/core/2/guides/main-concepts/data-storage/)
* [Querying](https://docs.kuzzle.io/core/2/guides/main-concepts/querying/)
* [Permissions](https://docs.kuzzle.io/core/2/guides/main-concepts/permissions/)
* [Authentication](https://docs.kuzzle.io/core/2/guides/main-concepts/authentication/)
* [Realtime Engine](https://docs.kuzzle.io/core/2/guides/main-concepts/realtime-engine/)
* [Discover our SDKs](https://docs.kuzzle.io/sdk/v2.html)
* [Release Notes](https://github.com/kuzzleio/kuzzle/releases)

## Get trained by the creators of Kuzzle :zap:

Train yourself and your teams to use Kuzzle to maximize its potential and accelerate the development of your projects.
Our teams will be able to meet your needs in terms of expertise and multi-technology support for IoT, mobile/web, backend/frontend, devops.
:point_right: [Get a quote](https://kuzzle.io/pricing/)


## Join our community

* Follow us on [twitter](https://twitter.com/kuzzleio) to get latest news
* Register to our monthly [newsletter](http://eepurl.com/bxRxpr) to get highlighed news
* Visit our [blog](https://blog.kuzzle.io/) to be informed about what we are doing
* Come chat with us on [Discord](http://join.discord.kuzzle.io)
* Ask technical questions on [stack overflow](https://stackoverflow.com/search?q=kuzzle)

## License

Kuzzle is published under [Apache 2 License](https://github.com/kuzzleio/kuzzle/blob/master/LICENSE).

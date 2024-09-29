<p align="center">
  <img src="https://user-images.githubusercontent.com/7868838/103797784-32337580-5049-11eb-8917-3fcf4487644c.png"/>
</p>
<p align="center">
  <img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/kuzzleio/template-kuzzle-project/master">
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

## Installation and run

Requirement:
 - Node.js = 20
 - NPM = 10.1.0
 - Docker
 - Docker-Compose

# Usage

```bash
docker compose watch
```

## Use the framework

Your first Kuzzle application is inside the `app.ts` file. This will be the entry point of your application.

```ts
import { MyApplication } from "./lib/MyApplication";

const app = new MyApplication();

app.start();
```

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
* Come chat with us on [Discord](https://join.discord.kuzzle.io)
* Ask technical questions on [stack overflow](https://stackoverflow.com/search?q=kuzzle)

## License

Kuzzle is published under [Apache 2 License](./LICENSE.md).


import { BadRequestError, Controller, KuzzleRequest } from "kuzzle";
import { MyApplication } from "#MyApplication";
import { ExampleManager } from "#/modules/example/exampleManager";
import { ApiController, ApiAction, ApiRoute } from "#utils/decorators/index";

@ApiController("example", {
  routePrefix: "example",
})
export class ExampleController extends Controller {
  public exampleManager: ExampleManager = new ExampleManager(
    global.app as MyApplication,
  );

  @ApiAction("sayHello")
  @ApiRoute({
    openapi: {
      description: "sayHello",
      parameters: [
        {
          in: "query",
          name: "name",
        },
      ],
      responses: {
        "200": {
          content: {
            "application/json": {
              schema: {
                $ref: "string",
              },
            },
          },
        },
      },
    },
    path: "/_hello",
    verb: "get",
  })
  async sayHello(request: KuzzleRequest): Promise<string> {
    try {
      const name = request.getString("name");

      return this.exampleManager.sayHello(name);
    } catch (error) {
      this.app.log.error(error);
      throw new BadRequestError(error);
    }
  }
}

import { HttpRoute } from "kuzzle";

/**
 * Decorator function to define an API route for a method.
 *
 * @param definition - An object containing the route definition.
 * @param definition.verb - The HTTP verb (e.g., 'GET', 'POST').
 * @param definition.path - The path for the route.
 * @param definition.openapi - Optional OpenAPI specification for the route.
 *
 * @returns A decorator function that adds the route definition to the target method.
 *
 * @example
 *
 * ### Example usage of the ApiRoute decorator to define a GET route at "/hello".
 *
 * ```ts
 * @ApiRoute({
 *   verb: "get",
 *   path: "/hello",
 *   openapi: {
 *     summary: "Say hello",
 *     description: "Say hello to the world or to a specific person",
 *     parameters: [
 *       {
 *         in: "query",
 *         name: "name",
 *         required: false,
 *         schema: {
 *           type: "string",
 *         },
 *       },
 *     ],
 *   },
 * })
 * async myAction(request: KuzzleRequest) {
 *   const name = request.input.args.name;
 *   return name ? "Hello " + name : "Hello, World!";
 * }
 * ```
 */
export function ApiRoute(definition: {
  verb: string;
  path: string;
  openapi?: any;
}) {
  return function ApiRouteDecorator(target: any, propertyKey: string) {
    if (!target.constructor.decoratedRoutes) {
      target.constructor.decoratedRoutes = new Map<string, HttpRoute>();
    }

    const propertyDefinition = target.constructor.decoratedRoutes.get(
      propertyKey,
    ) || { http: [] };

    const { openapi, path, verb } = definition;

    propertyDefinition.http.push({ openapi, path, verb });

    target.constructor.decoratedRoutes.set(propertyKey, propertyDefinition);
  };
}

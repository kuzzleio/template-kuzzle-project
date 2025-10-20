import { Backend, Controller } from "kuzzle";

/**
 * A decorator function for defining API controllers.
 *
 * @param controllerName - The name of the controller.
 * @param options - Optional settings for the controller.
 * @param options.routePrefix - An optional prefix to be added to all routes.
 * @returns A class decorator function that enhances the controller class with additional functionality.
 *
 * @template T - The type of the controller class.
 * @param constructor - The constructor of the controller class.
 *
 * @remarks
 * This decorator adds a `definition` property to the controller prototype, which contains an `actions` object.
 * It also adds a `use` method to the prototype, which allows the controller to be used with a backend application.
 * The original constructor is wrapped in a decorated constructor that processes decorated routes and applies
 * the optional route prefix to each route.
 *
 * @example
 * ```typescript
 * @ApiController('MyController', { routePrefix: '/api' })
 * class MyController extends Controller {
 *   // Controller implementation
 * }
 * ```
 */
export function ApiController(
  controllerName: string,
  options?: { routePrefix?: string },
) {
  return function ApiControllerDecorator<
    T extends { new (...args: any[]): Controller },
  >(constructor: T) {
    constructor.prototype.definition = {
      actions: {},
    };
    constructor.prototype.name = controllerName;

    constructor.prototype.use = function use<B extends Backend>(app: B) {
      ApiController.call(app, this);
    };

    const OriginalConstructor = constructor as new (...args: any[]) => any;
    const decoratedConstructor: any = function decoratedConstructor(
      ...args: any[]
    ) {
      const instance = new OriginalConstructor(...args);

      if (instance.constructor.decoratedRoutes) {
        // Assuming decoratedRoutes is a Map<string, HttpRoute>
        for (const [methodName, route] of instance.constructor
          .decoratedRoutes) {
          if (options?.routePrefix) {
            for (const httpRoute of route.http) {
              httpRoute.path = options.routePrefix + httpRoute.path;
            }
          }
          const name = route.name || methodName;
          const handler = instance[methodName].bind(instance);
          instance.definition.actions[name] = {
            handler,
            http: route.http,
          };
        }
      }

      return instance;
    };

    decoratedConstructor.prototype = OriginalConstructor.prototype;
    return decoratedConstructor;
  };
}

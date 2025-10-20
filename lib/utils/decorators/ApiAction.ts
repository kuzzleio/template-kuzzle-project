import { HttpRoute } from "kuzzle";

/**
 * A decorator function that registers an API action.
 *
 * @param name - An optional name for the API action. If not provided, the property key will be used as the name.
 * @returns A decorator function that registers the API action with the target's constructor.
 */
export function ApiAction(name?: string) {
  return function ApiActionDecorator(target: any, propertyKey: string) {
    if (!target.constructor.decoratedRoutes) {
      target.constructor.decoratedRoutes = new Map<string, HttpRoute>();
    }

    const definition = target.constructor.decoratedRoutes.get(propertyKey) || {
      http: [],
    };
    definition.name = name || propertyKey;

    target.constructor.decoratedRoutes.set(propertyKey, definition);
  };
}

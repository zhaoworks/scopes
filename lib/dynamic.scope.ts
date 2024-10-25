import type { ScopeInterface } from "./base.scope";

/**
 * Manages scopes using a Set for efficient lookup and modification.
 */
export class DynamicScope<S extends string>
  implements ScopeInterface<Set<S>, S>
{
  /**
   * Creates a new DynamicScope instance.
   * @param scopes The scope definition object
   */
  public constructor(_: Record<S, number>) {}

  /**
   * Checks if a given scope is present in the input.
   * @param scope The scope to check
   * @param input The input to check against
   * @returns True if the scope is present, false otherwise
   */
  public can(scope: S, input: Set<S>): boolean {
    return input.has(scope);
  }

  /**
   * Adds a scope to the input.
   * @param input The original input
   * @param scope The scope to add
   * @returns A new input with the scope added
   */
  public allow(input: Set<S>, scope: S): Set<S> {
    return new Set(input).add(scope);
  }

  /**
   * Removes a scope from the input.
   * @param input The original input
   * @param scope The scope to remove
   * @returns A new input with the scope removed
   */
  public deny(input: Set<S>, scope: S): Set<S> {
    const newSet = new Set(input);
    newSet.delete(scope);
    return newSet;
  }

  /**
   * Creates a new scope representation from a set of scopes.
   * @param scopes An object representing which scopes to include
   * @returns A new scope representation
   */
  public create(scopes: Partial<Record<S, boolean>>): Set<S> {
    return new Set(
      Object.entries(scopes)
        .filter(([, isAllowed]) => isAllowed)
        .map(([scope]) => scope as S),
    );
  }

  /**
   * Edits the input by allowing and denying multiple scopes at once.
   * @param input The original input
   * @param changes An object representing which scopes to allow (true) or deny (false)
   * @returns A new input with the specified changes applied
   */
  public edit(input: Set<S>, changes: Partial<Record<S, boolean>>): Set<S> {
    return Object.entries(changes).reduce((acc, [scope, isAllowed]) => {
      return isAllowed
        ? this.allow(acc, scope as S)
        : this.deny(acc, scope as S);
    }, new Set(input));
  }
}

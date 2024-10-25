import type { ScopeInterface } from "./base.scope";

/**
 * Manages scopes using bitwise operations for static-efficient storage and comparison.
 */
export class FlagScope<S extends string> implements ScopeInterface<number, S> {
  private scopeMap: Record<S, number>;

  /**
   * Creates a new FlagScope instance.
   * @param scopes The scope definition object
   */
  public constructor(scopes: Record<S, number>) {
    this.scopeMap = Object.entries(scopes).reduce(
      (acc, [scope, position]) => {
        acc[scope as S] = 1 << (position as number);
        return acc;
      },
      {} as Record<S, number>,
    );
  }

  /**
   * Checks if a given scope is present in the input.
   * @param scope The scope to check
   * @param input The input to check against
   * @returns True if the scope is present, false otherwise
   */
  public can(scope: S, input: number): boolean {
    return (input & this.scopeMap[scope]) !== 0;
  }

  /**
   * Adds a scope to the input.
   * @param input The original input
   * @param scope The scope to add
   * @returns A new input with the scope added
   */
  public allow(input: number, scope: S): number {
    return input | this.scopeMap[scope];
  }

  /**
   * Removes a scope from the input.
   * @param input The original input
   * @param scope The scope to remove
   * @returns A new input with the scope removed
   */
  public deny(input: number, scope: S): number {
    return input & ~this.scopeMap[scope];
  }

  /**
   * Creates a new scope representation from a set of scopes.
   * @param scopes An object representing which scopes to include
   * @returns A new scope representation
   */
  public create(scopes: Partial<Record<S, boolean>>): number {
    return Object.entries(scopes).reduce((acc, [scope, isAllowed]) => {
      return isAllowed ? this.allow(acc, scope as S) : acc;
    }, 0);
  }

  /**
   * Edits the input by allowing and denying multiple scopes at once.
   * @param input The original input
   * @param changes An object representing which scopes to allow (true) or deny (false)
   * @returns A new input with the specified changes applied
   */
  public edit(input: number, changes: Partial<Record<S, boolean>>): number {
    return Object.entries(changes).reduce((acc, [scope, isAllowed]) => {
      return isAllowed
        ? this.allow(acc, scope as S)
        : this.deny(acc, scope as S);
    }, input);
  }
}

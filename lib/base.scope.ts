/**
 * Defines the structure for scope definitions.
 * 
 * Each key is the name of a scope, and its corresponding value indicates the position or order 
 * of that scope within the system. This type is primarily used to map scope names to their 
 * numerical representations.
 */
export type ScopeDefinition = Record<string, number>;

/**
 * Defines the common interface for managing scopes within a system.
 *
 * @template T - The type used to represent the scope (e.g., `number` for FlagScope, `Set<string>` for DynamicScope).
 * @template S - The type for scope names, derived from `ScopeDefinition`.
 */
export interface ScopeInterface<T, S extends string> {
    /**
     * Determines if a specific scope is present within the provided input.
     *
     * @param scope - The scope to check for.
     * @param input - The input data where the scope will be checked.
     * @returns `true` if the scope is present, `false` otherwise.
     */
    can(scope: S, input: T): boolean;
  
    /**
     * Adds a specified scope to the input.
     *
     * @param input - The original input data.
     * @param scope - The scope to be added.
     * @returns The modified input with the new scope added.
     */
    allow(input: T, scope: S): T;
  
    /**
     * Removes a specified scope from the input.
     *
     * @param input - The original input data.
     * @param scope - The scope to be removed.
     * @returns The modified input with the scope removed.
     */
    deny(input: T, scope: S): T;
  
    /**
     * Creates a new scope representation based on the given set of scopes.
     *
     * @param scopes - An object indicating which scopes to include.
     * @returns A new representation of the scopes.
     */
    create(scopes: Partial<Record<S, boolean>>): T;
  
    /**
     * Modifies the input by allowing or denying multiple scopes at once.
     *
     * @param input - The original input data.
     * @param changes - An object specifying which scopes to allow (`true`) or deny (`false`).
     * @returns The modified input with the applied changes.
     */
    edit(input: T, changes: Partial<Record<S, boolean>>): T;
}

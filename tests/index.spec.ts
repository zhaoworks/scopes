import { expect, test, describe } from "bun:test";

import { FlagScope, DynamicScope } from "../lib/";

const scopeDefinition = {
  read: 0,
  write: 1,
  delete: 2,
  admin: 3,
} as const;

describe("Scopes Library", () => {
  describe("FlagScope", () => {
    const flagScope = new FlagScope(scopeDefinition);

    test("create", () => {
      const scopes = flagScope.create({ read: true, write: true });
      expect(flagScope.can("read", scopes)).toBe(true);
      expect(flagScope.can("write", scopes)).toBe(true);
      expect(flagScope.can("delete", scopes)).toBe(false);
      expect(flagScope.can("admin", scopes)).toBe(false);
    });

    test("allow", () => {
      const scopes = flagScope.create({ read: true });
      const updatedScopes = flagScope.allow(scopes, "write");
      expect(flagScope.can("read", updatedScopes)).toBe(true);
      expect(flagScope.can("write", updatedScopes)).toBe(true);
    });

    test("deny", () => {
      const scopes = flagScope.create({ read: true, write: true });
      const updatedScopes = flagScope.deny(scopes, "write");
      expect(flagScope.can("read", updatedScopes)).toBe(true);
      expect(flagScope.can("write", updatedScopes)).toBe(false);
    });

    test("edit", () => {
      const scopes = flagScope.create({ read: true, write: true });
      const updatedScopes = flagScope.edit(scopes, {
        write: false,
        delete: true,
      });
      expect(flagScope.can("read", updatedScopes)).toBe(true);
      expect(flagScope.can("write", updatedScopes)).toBe(false);
      expect(flagScope.can("delete", updatedScopes)).toBe(true);
    });
  });

  describe("DynamicScope", () => {
    const dynamicScope = new DynamicScope(scopeDefinition);

    test("create", () => {
      const scopes = dynamicScope.create({ read: true, write: true });
      expect(dynamicScope.can("read", scopes)).toBe(true);
      expect(dynamicScope.can("write", scopes)).toBe(true);
      expect(dynamicScope.can("delete", scopes)).toBe(false);
      expect(dynamicScope.can("admin", scopes)).toBe(false);
    });

    test("allow", () => {
      const scopes = dynamicScope.create({ read: true });
      const updatedScopes = dynamicScope.allow(scopes, "write");
      expect(dynamicScope.can("read", updatedScopes)).toBe(true);
      expect(dynamicScope.can("write", updatedScopes)).toBe(true);
    });

    test("deny", () => {
      const scopes = dynamicScope.create({ read: true, write: true });
      const updatedScopes = dynamicScope.deny(scopes, "write");
      expect(dynamicScope.can("read", updatedScopes)).toBe(true);
      expect(dynamicScope.can("write", updatedScopes)).toBe(false);
    });

    test("edit", () => {
      const scopes = dynamicScope.create({ read: true, write: true });
      const updatedScopes = dynamicScope.edit(scopes, {
        write: false,
        delete: true,
      });
      expect(dynamicScope.can("read", updatedScopes)).toBe(true);
      expect(dynamicScope.can("write", updatedScopes)).toBe(false);
      expect(dynamicScope.can("delete", updatedScopes)).toBe(true);
    });
  });

  describe("Consistency between FlagScope and DynamicScope", () => {
    const flagScope = new FlagScope(scopeDefinition);
    const dynamicScope = new DynamicScope(scopeDefinition);

    test("create consistency", () => {
      const flagScopes = flagScope.create({ read: true, write: true });
      const dynamicScopes = dynamicScope.create({ read: true, write: true });

      for (const scope of Object.keys(scopeDefinition)) {
        expect(
          flagScope.can(scope as keyof typeof scopeDefinition, flagScopes),
        ).toBe(
          dynamicScope.can(
            scope as keyof typeof scopeDefinition,
            dynamicScopes,
          ),
        );
      }
    });

    test("edit consistency", () => {
      const initialFlagScopes = flagScope.create({ read: true, write: true });
      const initialdynamicScopes = dynamicScope.create({
        read: true,
        write: true,
      });

      const editedFlagScopes = flagScope.edit(initialFlagScopes, {
        write: false,
        delete: true,
      });
      const editeddynamicScopes = dynamicScope.edit(initialdynamicScopes, {
        write: false,
        delete: true,
      });

      for (const scope of Object.keys(scopeDefinition)) {
        expect(
          flagScope.can(
            scope as keyof typeof scopeDefinition,
            editedFlagScopes,
          ),
        ).toBe(
          dynamicScope.can(
            scope as keyof typeof scopeDefinition,
            editeddynamicScopes,
          ),
        );
      }
    });
  });
});

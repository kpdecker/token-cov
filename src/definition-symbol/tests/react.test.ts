import ts from "typescript";
import {
  dumpInferred,
  findIdentifiers,
  findNodeInTree,
  mockProgram,
} from "../../../test/utils";
import { defineSymbol } from "../index";

const program = mockProgram({
  "test.tsx": `
    import React, { ReactNode } from 'react';
    import styled from '@emotion/styled';

    const SimpleTemplate = styled.div\`
      color: red;
    \`;

    const GenericTemplate = styled.div<{ myProp: number }>\`
      color: red;
      \${({ myProp }) => myProp}
    \`;


    const foo = (
      <div>{bar}</div>
    );

    function Bar() {
      return <></>;
    }

    const bat = { Bar };

    export function MyComponent() {
      return (
        <soup>
          <SimpleTemplate />
          {foo}
          <GenericTemplate myProp={1} {...bat} ignore-prop />
          <bat.Bar myProp={2} />
        </soup>
      );
    }

    export function WithInlineProps({ children }: { children: ReactNode; }) {
      return <>
        {bat && children}
        <WithAnyProps anyProp />
      </>;
    }

    export function WithAnyProps({ anyProp }) {
      return <>{anyProp}</>;
    }
  `,
});
const checker = program.getTypeChecker();
const sourceFile = program.getSourceFile("test.tsx")!;

describe("react", () => {
  it("should resolve imported types", () => {
    const styledNodes = findIdentifiers(sourceFile, "styled");
    const styledDefinition = defineSymbol(styledNodes[1], checker);
    expect(dumpInferred(styledDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 12,
            "fileName": "@types/react/index.d.ts",
            "kind": "PropertySignature",
            "line": 3171,
            "name": "div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;",
            "path": "global.JSX.IntrinsicElements.div",
          },
        ],
        "type": "CreateStyledComponent<{ theme?: Theme; as?: ElementType<any>; }, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>",
      }
    `);
  });
  it("should resolve template literals", () => {
    const simpleTemplateNodes = findIdentifiers(sourceFile, "SimpleTemplate");
    const simpleTemplateDefinition = defineSymbol(
      simpleTemplateNodes[1],
      checker
    );
    expect(dumpInferred(simpleTemplateDefinition, checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 10,
            "fileName": "test.tsx",
            "kind": "VariableDeclaration",
            "line": 5,
            "name": "SimpleTemplate = styled.div\`",
            "path": "SimpleTemplate",
          },
        ],
        "type": "StyledComponent<{ theme?: Theme; as?: ElementType<any>; }, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>",
      }
    `);
  });
  it("should resolve tagged template literals", () => {
    const genericTemplateNodes = findIdentifiers(sourceFile, "GenericTemplate");
    const genericTemplateDefinition = defineSymbol(
      genericTemplateNodes[1],
      checker
    );
    expect(dumpInferred(genericTemplateDefinition, checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 10,
            "fileName": "test.tsx",
            "kind": "VariableDeclaration",
            "line": 9,
            "name": "GenericTemplate = styled.div<{ myProp: number }>\`",
            "path": "GenericTemplate",
          },
        ],
        "type": "StyledComponent<{ theme?: Theme; as?: ElementType<any>; } & { myProp: number; }, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>",
      }
    `);
  });
  it("should resolve jsx attributes in styled template", () => {
    const propertyNodes = findIdentifiers(sourceFile, "myProp");
    const arrowDefinition = defineSymbol(propertyNodes[2].parent, checker);
    expect(dumpInferred(arrowDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 8,
            "fileName": "test.tsx",
            "kind": "ArrowFunction",
            "line": 11,
            "name": "({ myProp }) => myProp",
            "path": "GenericTemplate.=>",
          },
        ],
        "type": "({ myProp }: { theme?: Theme; as?: ElementType<any>; } & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement> & { ...; } & { ...; }) => number",
      }
    `);
    const propertyDefinition = defineSymbol(propertyNodes[1], checker);
    expect(dumpInferred(propertyDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 41,
            "fileName": "test.tsx",
            "kind": "PropertySignature",
            "line": 9,
            "name": "myProp: number",
            "path": "GenericTemplate.myProp",
          },
        ],
        "type": "number",
      }
    `);
  });
  it("should resolve jsx attributes", () => {
    const propertyNodes = findIdentifiers(sourceFile, "myProp");
    const propertyDefinition = defineSymbol(propertyNodes[3], checker);
    expect(dumpInferred(propertyDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 41,
            "fileName": "test.tsx",
            "kind": "PropertySignature",
            "line": 9,
            "name": "myProp: number",
            "path": "GenericTemplate.myProp",
          },
        ],
        "type": "number",
      }
    `);
  });
  it("should handle jsx expressions", () => {
    const fooNodes = findIdentifiers(sourceFile, "foo");
    const fooDefinition = defineSymbol(fooNodes[1], checker);
    expect(dumpInferred(fooDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 10,
            "fileName": "test.tsx",
            "kind": "VariableDeclaration",
            "line": 15,
            "name": "foo = (",
            "path": "foo",
          },
        ],
        "type": "Element",
      }
    `);
    const fooExpression = defineSymbol(fooNodes[1].parent, checker);
    expect(dumpInferred(fooExpression, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 10,
            "fileName": "test.tsx",
            "kind": "VariableDeclaration",
            "line": 15,
            "name": "foo = (",
            "path": "foo",
          },
        ],
        "type": "Element",
      }
    `);
  });
  it("should resolve jsx spread operators", () => {
    const styledNodes = findIdentifiers(sourceFile, "bat");
    const componentNode = styledNodes[1].parent;
    const styledDefinition = defineSymbol(componentNode, checker);
    expect(dumpInferred(styledDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 10,
            "fileName": "test.tsx",
            "kind": "VariableDeclaration",
            "line": 23,
            "name": "bat = { Bar }",
            "path": "bat",
          },
        ],
        "type": "{ Bar: () => Element; }",
      }
    `);
  });
  it("should resolve jsx return", () => {
    const myComponentNodes = findIdentifiers(sourceFile, "MyComponent");
    const myComponentDefinition = defineSymbol(myComponentNodes[0], checker);
    expect(dumpInferred(myComponentDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 4,
            "fileName": "test.tsx",
            "kind": "FunctionDeclaration",
            "line": 25,
            "name": "MyComponent",
            "path": "MyComponent",
          },
        ],
        "type": "() => Element",
      }
    `);
  });
  it("should resolve jsx element property access", () => {
    const styledNodes = findIdentifiers(sourceFile, "Bar");
    const componentNode = styledNodes[1].parent;
    const styledDefinition = defineSymbol(componentNode, checker);
    expect(dumpInferred(styledDefinition, checker)).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 18,
            "fileName": "test.tsx",
            "kind": "ShorthandPropertyAssignment",
            "line": 23,
            "name": "Bar",
            "path": "bat.Bar",
          },
        ],
        "type": "() => Element",
      }
    `);
  });
  it("should resolve jsx intrinsic element", () => {
    const styledNodes = findIdentifiers(sourceFile, "div");
    const componentNode = styledNodes[2].parent;
    const styledDefinition = defineSymbol(componentNode, checker);
    const dump = dumpInferred(styledDefinition, checker);
    expect(dump).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 12,
            "fileName": "@types/react/index.d.ts",
            "kind": "PropertySignature",
            "line": 3171,
            "name": "div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;",
            "path": "global.JSX.IntrinsicElements.div",
          },
        ],
        "type": "DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>",
      }
    `);
  });
  it("should resolve fragments", () => {
    const fragmentNode = findNodeInTree(sourceFile, ts.isJsxFragment)!;
    expect(dumpInferred(defineSymbol(fragmentNode, checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [],
        "type": "any",
      }
    `);
    expect(
      dumpInferred(defineSymbol(fragmentNode.closingFragment, checker), checker)
    ).toMatchInlineSnapshot(`
      Object {
        "symbol": Array [],
        "type": "any",
      }
    `);
  });

  it("should resolve property parameters", () => {
    const childrenNodes = findIdentifiers(sourceFile, "children");

    // Declaration
    expect(dumpInferred(defineSymbol(childrenNodes[1], checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 52,
            "fileName": "test.tsx",
            "kind": "PropertySignature",
            "line": 36,
            "name": "children: ReactNode;",
            "path": "WithInlineProps.children",
          },
        ],
        "type": "ReactNode",
      }
    `);

    // Destructure
    expect(dumpInferred(defineSymbol(childrenNodes[0], checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 52,
            "fileName": "test.tsx",
            "kind": "PropertySignature",
            "line": 36,
            "name": "children: ReactNode;",
            "path": "WithInlineProps.children",
          },
        ],
        "type": "ReactNode",
      }
    `);

    // Use
    expect(dumpInferred(defineSymbol(childrenNodes[2], checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 52,
            "fileName": "test.tsx",
            "kind": "PropertySignature",
            "line": 36,
            "name": "children: ReactNode;",
            "path": "WithInlineProps.children",
          },
        ],
        "type": "ReactNode",
      }
    `);
  });

  it("should ignore dash props", () => {
    const ignorePropNodes = findIdentifiers(sourceFile, "ignore-prop");
    expect(dumpInferred(defineSymbol(ignorePropNodes[0], checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 47,
            "fileName": "test.tsx",
            "kind": "JsxAttribute",
            "line": 30,
            "name": "ignore-prop",
            "path": "GenericTemplate.ignore-prop",
          },
        ],
        "type": "true",
      }
    `);
  });

  it("should handle implicit any props", () => {
    const ignorePropNodes = findIdentifiers(sourceFile, "anyProp");

    // Attribute
    expect(dumpInferred(defineSymbol(ignorePropNodes[0], checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 35,
            "fileName": "test.tsx",
            "kind": "BindingElement",
            "line": 43,
            "name": "anyProp",
            "path": "WithAnyProps.anyProp",
          },
        ],
        "type": "any",
      }
    `);

    // Definition
    expect(dumpInferred(defineSymbol(ignorePropNodes[1], checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 35,
            "fileName": "test.tsx",
            "kind": "BindingElement",
            "line": 43,
            "name": "anyProp",
            "path": "WithAnyProps.anyProp",
          },
        ],
        "type": "any",
      }
    `);

    // Use
    expect(dumpInferred(defineSymbol(ignorePropNodes[2], checker), checker))
      .toMatchInlineSnapshot(`
      Object {
        "symbol": Array [
          Object {
            "column": 35,
            "fileName": "test.tsx",
            "kind": "BindingElement",
            "line": 43,
            "name": "anyProp",
            "path": "WithAnyProps.anyProp",
          },
        ],
        "type": "any",
      }
    `);
  });

  // TODO: Object literal inference in attributes
});

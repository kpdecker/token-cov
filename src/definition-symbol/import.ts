import invariant from "tiny-invariant";
import ts, { findAncestor } from "typescript";
import { logWarn } from "../logger";
import { getSymbolDeclaration } from "../utils";
import { directTypeAndSymbol, invariantNode, nodeOperators } from "./utils";

export const importOperators = nodeOperators({
  [ts.SyntaxKind.ImportType]: directTypeAndSymbol,
  [ts.SyntaxKind.NamespaceExportDeclaration]: directTypeAndSymbol,
  [ts.SyntaxKind.ImportEqualsDeclaration]: directTypeAndSymbol,
  [ts.SyntaxKind.ImportDeclaration]: directTypeAndSymbol,
  [ts.SyntaxKind.ImportClause]: directTypeAndSymbol,
  [ts.SyntaxKind.NamespaceImport]: directTypeAndSymbol,
  [ts.SyntaxKind.NamedImports]: directTypeAndSymbol,
  [ts.SyntaxKind.ImportSpecifier](node, checker) {
    const importDeclaration = findAncestor(node, ts.isImportDeclaration);

    invariantNode(node, ts.isImportSpecifier);
    invariant(importDeclaration);

    const externalModule: ts.Symbol = (
      checker as any
    ).resolveExternalModuleName(importDeclaration.moduleSpecifier);
    if (!externalModule) {
      logWarn(
        "Failed to resolve externalModule",
        importDeclaration.moduleSpecifier
      );
      return null;
    }

    const name = (node.propertyName || node.name).getText();
    const member = checker.tryGetMemberInModuleExports(name, externalModule);
    const memberDeclaration = getSymbolDeclaration(member);
    if (memberDeclaration) {
      return {
        type: checker.getTypeAtLocation(memberDeclaration),
        symbol: member,
      };
    } else {
      logWarn(`Could not find member ${name} in ${externalModule.name}`);
    }

    return directTypeAndSymbol(node, checker);
  },
  [ts.SyntaxKind.ExportAssignment]: directTypeAndSymbol,
  [ts.SyntaxKind.ExportDeclaration]: directTypeAndSymbol,
  [ts.SyntaxKind.NamedExports]: directTypeAndSymbol,
  [ts.SyntaxKind.NamespaceExport]: directTypeAndSymbol,
  [ts.SyntaxKind.ExportSpecifier]: directTypeAndSymbol,
  [ts.SyntaxKind.ExternalModuleReference]: directTypeAndSymbol,
  [ts.SyntaxKind.ImportTypeAssertionContainer]: directTypeAndSymbol,
  [ts.SyntaxKind.AssertClause]: directTypeAndSymbol,
  [ts.SyntaxKind.AssertEntry]: directTypeAndSymbol,
  [ts.SyntaxKind.MetaProperty]: directTypeAndSymbol, // import.foo
});

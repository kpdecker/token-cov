import ts from "typescript";
import { directTypeAndSymbol, nodeOperators } from "./utils";

export const jsDocHandlers = nodeOperators({
  [ts.SyntaxKind.JSDocTypeExpression]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocNameReference]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocMemberName]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocAllType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocUnknownType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocNullableType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocNonNullableType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocOptionalType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocFunctionType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocVariadicType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocNamepathType]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocComment]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocText]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocTypeLiteral]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocSignature]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocLink]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocLinkCode]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocLinkPlain]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocAugmentsTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocImplementsTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocAuthorTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocDeprecatedTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocClassTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocPublicTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocPrivateTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocProtectedTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocReadonlyTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocOverrideTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocCallbackTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocEnumTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocParameterTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocReturnTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocThisTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocTypeTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocTemplateTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocTypedefTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocSeeTag]: directTypeAndSymbol,
  [ts.SyntaxKind.JSDocPropertyTag]: directTypeAndSymbol,
});

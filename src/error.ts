import ts from "typescript";

export class NodeError extends Error {
  isNodeError = true;
  // cause: Error | undefined;

  constructor(
    message: string,
    node: ts.Node,
    checker: ts.TypeChecker,
    cause?: Error
  ) {
    super(
      `${message} for ${node.getSourceFile().fileName} ${
        ts.SyntaxKind[node.kind]
      }`
    );
    (this as any).cause = cause;
  }
}
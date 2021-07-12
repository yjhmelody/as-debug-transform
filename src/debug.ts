import {
    BlockStatement,
    MethodDeclaration,
    FunctionDeclaration,
    Statement,
    DecoratorNode,
    Range,
    Source,
} from "assemblyscript";
import { TransformVisitor } from "visitor-as";
import { hasDecorator } from "./util";


type DebugNode = {
    body: Statement | null;
    decorators: DecoratorNode[] | null;
    range: Range;
};

export class DebugVisitor extends TransformVisitor {
    debugMode = "debugMode";
    debugModeEnv = "DEBUG_MODE";

    visitSource(node: Source): Source {
        if (!this.shouldRemove()) {
            return node;
        }
        return super.visitSource(node);
    }

    visitMethodDeclaration(node: MethodDeclaration): MethodDeclaration {
        return this.removeBody(node);
    }

    visitFunctionDeclaration(
        node: FunctionDeclaration,
        _isDefault?: boolean
    ): FunctionDeclaration {
        return this.removeBody(node);
    }

    protected removeBody<T extends DebugNode>(node: T): T {
        if (hasDecorator(node.decorators, this.debugMode)) {
            // remove all stmts for method
            node.body = new BlockStatement([], node.range);
        }
        return node;
    }

    protected shouldRemove(): boolean {
        const env = process.env[this.debugModeEnv];
        if (env === '1' || env === 'true' || env === '*') {
            return true;
        }

        if (env === 'release' && ASC_OPTIMIZE_LEVEL > 1) {
            return true;
        }

        return false;
    }

    // TODO: support more decls
}

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


type DebugFunction = {
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

    protected removeBody<T extends DebugFunction>(node: T): T {
        if (hasDecorator(node.decorators, this.debugMode)) {
            // remove all stmts for method
            node.body = new BlockStatement([], node.range);
        }
        return node;
    }

    protected shouldRemove(): boolean {
        let env = process.env[this.debugModeEnv];
        if (env === 'debug' && ASC_OPTIMIZE_LEVEL < 2) {
            return false;
        }
        else if (env === '0' || env === 'false') {
            return false;
        }
        return true;
    }

    // TODO: support more decls
}

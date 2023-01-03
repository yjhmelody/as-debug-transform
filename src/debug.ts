import {
    BlockStatement,
    MethodDeclaration,
    FunctionDeclaration,
    Statement,
    DecoratorNode,
    Range,
    Source,
} from "assemblyscript/dist/assemblyscript.js";
import { TransformVisitor } from "visitor-as";
import { hasDecorator } from "./util.js";

type DebugFunction = {
    body: Statement | null;
    decorators: DecoratorNode[] | null;
    range: Range;
};

export class DebugVisitor extends TransformVisitor {
    debugMode = "debugMode";
    debugModeEnv = "DEBUG_MODE";
    protected removed: null | boolean = null;

    visitSource(node: Source): Source {
        if (!this.shouldRemove()) {
            return node;
        }
        return super.visitSource(node);
    }

    visitMethodDeclaration(node: MethodDeclaration): MethodDeclaration {

        if (!this.shouldRemove()) {
            return node;
        }
        return this.removeBody(node);
    }

    visitFunctionDeclaration(
        node: FunctionDeclaration,
        _isDefault?: boolean
    ): FunctionDeclaration {
        if (!this.shouldRemove()) {
            return node;
        }
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
        if (this.removed != null) {
            return this.removed;
        }
        let env = process.env[this.debugModeEnv];
        if (env === 'debug' && ASC_OPTIMIZE_LEVEL < 2) {
            this.removed = false;
            return this.removed;
        }
        else if (env === '0' || env === 'false') {
            this.removed = false;
            return this.removed;
        }
        this.removed = true;
        return this.removed;
    }

    // TODO: support more decls
}

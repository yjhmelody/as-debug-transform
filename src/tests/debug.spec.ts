/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ASTBuilder, SimpleParser } from "visitor-as";
import { DebugVisitor } from "../debug.js";
import * as assert from "assert";

function checkDebugVisitor(
    visitor: DebugVisitor,
    code: string,
    expected: string
): void {
    let stmt = SimpleParser.parseTopLevelStatement(code, null);
    visitor.visit(stmt);
    const actual = ASTBuilder.build(stmt).trim();
    assert.equal(actual, expected);
}

describe("DebugVisitor", () => {
    it("debug methods", () => {
        const code = `
class Debug {
  @debugMode
  static println(msg: string): void {
    console.log(msg);
  }

  @debugMode
  panic(): void {
    unreachable();
  }
}
`.trim();
        const expected = `
class Debug {
  @debugMode
  static println(msg: string): void {}
  @debugMode
  panic(): void {}
}
  `.trim();
        const visitor = new DebugVisitor();
        checkDebugVisitor(visitor, code, expected);
    });

    it("debug functions", () => {
        const code = `
@debugMode
function println(msg: string): void {
  console.log(msg);
}
`.trim();
        const expected = `
@debugMode
function println(msg: string): void {}
  `.trim();
        const visitor = new DebugVisitor();
        checkDebugVisitor(visitor, code, expected);
    });


    it("do not erase", () => {
        const code = `
@debugMode
function println(msg: string): void {
  console.log(msg);
}
`.trim();
        process.env["DEBUG_MODE"] = '0';
        const visitor = new DebugVisitor();
        checkDebugVisitor(visitor, code, code);
        process.env["DEBUG_MODE"] = undefined;
    });
});

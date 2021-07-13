/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ASTBuilder, Parser } from "visitor-as/as";
import { DebugVisitor } from "../debug";

function checkDebugVisitor(
    visitor: DebugVisitor,
    code: string,
    expected: string
): void {
    const parser = new Parser();
    parser.parseFile(code, "index.ts", true);
    visitor.visit(parser.sources[0]);
    const actual = ASTBuilder.build(parser.sources[0]);
    expect(actual.trim()).toBe(expected);
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
@debugMode
function debugAssert(b: bool, msg: string): void {
  assert(b, msg);
}

`.trim();
        const expected = `
@debugMode
function println(msg: string): void {}
@debugMode
function debugAssert(b: bool, msg: string): void {}
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
        const visitor = new DebugVisitor();
        process.env["DEBUG_MODE"] = '0';
        checkDebugVisitor(visitor, code, code);
        process.env["DEBUG_MODE"] = undefined;
    });

});

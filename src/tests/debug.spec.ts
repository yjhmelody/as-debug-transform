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
    process.env["DEBUG_MODE"] = '1';
    visitor.visit(parser.sources[0]);
    process.env["DEBUG_MODE"] = undefined;
    const actual = ASTBuilder.build(parser.sources[0]);
    expect(actual.trim()).toBe(expected);
}

describe("DebugVisitor", () => {
    it("debug methods", () => {
        const code = `
class DebugMessage {
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
class DebugMessage {
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


});

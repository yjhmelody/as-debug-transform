import { DecoratorNode } from "assemblyscript";

/**
 *
 * @param decorators a group decorators
 * @param name a decorator name
 * @returns return true if has the decorator
 */
export function hasDecorator(
    decorators: DecoratorNode[] | null,
    name: string
): boolean {
    return getDecorator(decorators, name) ? true : false;
}

/**
 * Return the first matched decorator
 * @param decorators a group decorators
 * @param name a decorator name
 * @returns
 */
export function getDecorator(
    decorators: DecoratorNode[] | null,
    name: string
): DecoratorNode | null {
    if (decorators == null) {
        return null;
    }
    const decs = filterDecorators(
        decorators,
        (node) => node.name.range.toString() === "@" + name
    );
    return decs.length > 0 ? decs[0] : null;
}

/**
 *
 * @param decorators
 * @param pred a filter function for decorators
 * @returns
 */
export function filterDecorators(
    decorators: DecoratorNode[] | null,
    pred: (node: DecoratorNode) => bool
): DecoratorNode[] {
    const decs: DecoratorNode[] = [];
    if (decorators === null) return decs;
    for (const decorator of decorators) {
        if (pred(decorator)) decs.push(decorator);
    }
    return decs;
}
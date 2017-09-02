import XRegExp = require('xregexp');
import { Operation } from 'fast-json-patch';

export interface IPatcher {
    patches: Operation[];
    apply(content: string): string;
}

export class SlickPatchParser {

    static stringify(operation: Operation): string {
        if (operation.op == "add") {
            return "+ " + operation.path + " => " + JSON.stringify(operation.value);
        } else if (operation.op == "remove") {
            return "- " + operation.path;
        } else if (operation.op == "replace") {
            return "= " + operation.path + " => " + JSON.stringify(operation.value);
        } else if (operation.op == "copy") {
            return "+ " + operation.from + " => " + operation.path;
        } else if (operation.op == "move") {
            return "+ " + operation.from + " => " + operation.path;
        } else if (operation.op == "test") {
            return "+ " + operation.path + " => " + JSON.stringify(operation.value);
        }
        return "Unknown operation";
    }

    parse(sourcePatch: string): Operation[] {
        var result: Operation[] = [];

        XRegExp.forEach(sourcePatch, XRegExp('^\\s*(?<op>\\+|-|=|&|>|\\?)\\s*(?<path>.*?)\\s*(=>\\s*(?<value>.*))?$', 'gm'), (match) => {
            var op = (<any>match).op;
            if (op == "+") {
                result.push({
                    op: "add",
                    path: (<any>match).path,
                    value: this.parseValue(match)
                });
            } else if (op == "-") {
                result.push({
                    op: "remove",
                    path: (<any>match).path
                });
            } else if (op == "=") {
                result.push({
                    op: "replace",
                    path: (<any>match).path,
                    value: this.parseValue(match)
                });
            } else if (op == "&") {
                result.push({
                    op: "copy",
                    path: (<any>match).value,
                    from: (<any>match).path
                });
            } else if (op == ">") {
                result.push({
                    op: "move",
                    path: (<any>match).value,
                    from: (<any>match).path
                });
            } else if (op == "?") {
                result.push({
                    op: "test",
                    path: (<any>match).path,
                    value: this.parseValue(match)
                });
            } else {
                throw new Error("operator " + op + " is no supported.");
            }
        });

        return result;
    }

    private parseValue(match: RegExpExecArray) : any {
        try {
            return JSON.parse((<any>match).value);
        } catch (error) {
            throw new Error("Failed to parse value at line " + String(match.index) + ": `"+ match.input +"`, " + String(error));
        }
    }
}

import XRegExp = require('xregexp');
import { Operation } from 'fast-json-patch';

export interface IPatcher {
    patches: Operation[];
    apply(content: string): string;
}

export class SlickPatchParser {
    parse(sourcePatch: string): Operation[] {
        var result: Operation[] = [];

        XRegExp.forEach(sourcePatch, XRegExp('^\\s*(?<op>\\+|-|=|&|>|\\?)\\s*(?<path>.*?)\\s*(=>\\s*(?<value>.*))?$','gm'), (match) => {
            var op = (<any>match).op;
            if (op == "+"){
                result.push({
                    op : "add",
                    path : (<any>match).path,
                    value : JSON.parse((<any>match).value)
                });
            } else if (op == "-") { 
                result.push({
                    op : "remove",
                    path : (<any>match).path
                });
            } else if (op == "=") { 
                result.push({
                    op : "replace",
                    path : (<any>match).path,
                    value : JSON.parse((<any>match).value)
                });
            } else if (op == "&") { 
                result.push({
                    op : "copy",
                    path : (<any>match).value,
                    from : (<any>match).path
                });
            } else if (op == ">") { 
                result.push({
                    op : "move",
                    path : (<any>match).value,
                    from : (<any>match).path
                });
            } else if (op == "?") { 
                result.push({
                    op : "test",
                    path : (<any>match).path,
                    value : JSON.parse((<any>match).value)
                });
            } else {
                throw new Error("operator " + op + " is no supported.");
            }
        });

        return  result;
    }
}

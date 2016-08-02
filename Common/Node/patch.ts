import XRegExp = require('xregexp');

export interface IPatch{
    op: string;
    path: string;
    value?: any;
    from?: string;
}

export interface IPatcher {
    apply(content: string): string;
}

export class SlickPatchParser {
    parse(sourcePatch: string): IPatch[] {
        var result: IPatch[] = [];

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

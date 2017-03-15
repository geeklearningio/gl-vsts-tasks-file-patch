"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XRegExp = require("xregexp");
var SlickPatchParser = (function () {
    function SlickPatchParser() {
    }
    SlickPatchParser.prototype.parse = function (sourcePatch) {
        var result = [];
        XRegExp.forEach(sourcePatch, XRegExp('^\\s*(?<op>\\+|-|=|&|>|\\?)\\s*(?<path>.*?)\\s*(=>\\s*(?<value>.*))?$', 'gm'), function (match) {
            var op = match.op;
            if (op == "+") {
                result.push({
                    op: "add",
                    path: match.path,
                    value: JSON.parse(match.value)
                });
            }
            else if (op == "-") {
                result.push({
                    op: "remove",
                    path: match.path
                });
            }
            else if (op == "=") {
                result.push({
                    op: "replace",
                    path: match.path,
                    value: JSON.parse(match.value)
                });
            }
            else if (op == "&") {
                result.push({
                    op: "copy",
                    path: match.value,
                    from: match.path
                });
            }
            else if (op == ">") {
                result.push({
                    op: "move",
                    path: match.value,
                    from: match.path
                });
            }
            else if (op == "?") {
                result.push({
                    op: "test",
                    path: match.path,
                    value: JSON.parse(match.value)
                });
            }
            else {
                throw new Error("operator " + op + " is no supported.");
            }
        });
        return result;
    };
    return SlickPatchParser;
}());
exports.SlickPatchParser = SlickPatchParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFvQztBQWFwQztJQUFBO0lBZ0RBLENBQUM7SUEvQ0csZ0NBQUssR0FBTCxVQUFNLFdBQW1CO1FBQ3JCLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUUxQixPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsdUVBQXVFLEVBQUMsSUFBSSxDQUFDLEVBQUUsVUFBQyxLQUFLO1lBQ3RILElBQUksRUFBRSxHQUFTLEtBQU0sQ0FBQyxFQUFFLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFBLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDUixFQUFFLEVBQUcsS0FBSztvQkFDVixJQUFJLEVBQVMsS0FBTSxDQUFDLElBQUk7b0JBQ3hCLEtBQUssRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFPLEtBQU0sQ0FBQyxLQUFLLENBQUM7aUJBQ3pDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ1IsRUFBRSxFQUFHLFFBQVE7b0JBQ2IsSUFBSSxFQUFTLEtBQU0sQ0FBQyxJQUFJO2lCQUMzQixDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNSLEVBQUUsRUFBRyxTQUFTO29CQUNkLElBQUksRUFBUyxLQUFNLENBQUMsSUFBSTtvQkFDeEIsS0FBSyxFQUFHLElBQUksQ0FBQyxLQUFLLENBQU8sS0FBTSxDQUFDLEtBQUssQ0FBQztpQkFDekMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDUixFQUFFLEVBQUcsTUFBTTtvQkFDWCxJQUFJLEVBQVMsS0FBTSxDQUFDLEtBQUs7b0JBQ3pCLElBQUksRUFBUyxLQUFNLENBQUMsSUFBSTtpQkFDM0IsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDUixFQUFFLEVBQUcsTUFBTTtvQkFDWCxJQUFJLEVBQVMsS0FBTSxDQUFDLEtBQUs7b0JBQ3pCLElBQUksRUFBUyxLQUFNLENBQUMsSUFBSTtpQkFDM0IsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDUixFQUFFLEVBQUcsTUFBTTtvQkFDWCxJQUFJLEVBQVMsS0FBTSxDQUFDLElBQUk7b0JBQ3hCLEtBQUssRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFPLEtBQU0sQ0FBQyxLQUFLLENBQUM7aUJBQ3pDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsR0FBRyxFQUFFLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUUsTUFBTSxDQUFDO0lBQ25CLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFoREQsSUFnREM7QUFoRFksNENBQWdCIn0=
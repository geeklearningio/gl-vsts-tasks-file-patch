import json5Patcher = require("../../Tasks/JsonPatch/json5Patcher");
var JSON5 = require("../../Tasks/JsonPatch/node_modules/json5");



describe("JSON5 Patcher", () => {

    describe("Operations", () => {

        var source: string;

        beforeEach(function () {
            source = JSON5.stringify({
                sampleValue: "12"
            });
        });

        describe("JSON5 Output Enabled", () => {
            describe("Add", () => {
                it(": should support basic add.", () => {
                    var patcher = new json5Patcher.Json5Patcher([
                        {
                            op: "add", path: "/added", value: {}
                        }, {
                            op: "add", path: "/added/value", value: "42"
                        }
                    ], true);
                    var result = JSON5.parse(patcher.apply(source));

                    expect(result).toBeDefined();
                    expect(result.sampleValue).toBeDefined();
                    expect(result.sampleValue).toEqual("12");
                    expect(result.added.value).toEqual("42");
                });
            });
        });

        describe("JSON5 Output Disabled", () => {
            describe("Add", () => {
                it(": should support basic add.", () => {
                    var patcher = new json5Patcher.Json5Patcher([
                        {
                            op: "add", path: "/added", value: {}
                        }, {
                            op: "add", path: "/added/value", value: "42"
                        }
                    ], false);
                    var result = JSON.parse(patcher.apply(source));

                    expect(result).toBeDefined();
                    expect(result.sampleValue).toBeDefined();
                    expect(result.sampleValue).toEqual("12");
                    expect(result.added.value).toEqual("42");
                });
            });
        });
    });
});
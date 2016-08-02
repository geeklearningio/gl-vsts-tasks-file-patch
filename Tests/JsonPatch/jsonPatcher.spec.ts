import jsonPatcher = require("../../Tasks/JsonPatch/common/jsonPatcher");



describe("JSON Patcher", () => {

    describe("Operations", () => {
    
        var source: string;

        beforeEach(function() {
            source = JSON.stringify({
                sampleValue : "12"
            });
        });

        describe("Add", () => {
            it(": should support basic add.", () => {
                var patcher = new jsonPatcher.JsonPatcher([
                    { 
                        op: "add", path: "/added", value: {}
                    },{
                        op: "add", path: "/added/value", value: "42" 
                    }
                ]);
                var result = JSON.parse(patcher.apply(source));

                expect(result).toBeDefined();
                expect(result.sampleValue).toBeDefined();
                expect(result.sampleValue).toEqual("12");
                expect(result.added.value).toEqual("42");
            });
        });
    });
});
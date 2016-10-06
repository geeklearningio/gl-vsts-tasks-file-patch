import yamlPatcher = require("../../Tasks/YamlPatch/yamlPatcher");
var jsYaml = require("../../Tasks/YamlPatch/node_modules/js-yaml");


describe("YANL Patcher", () => {

    describe("Operations", () => {
    
        var source: string;

        beforeEach(function() {
            source = jsYaml.safeDump({
                sampleValue : "12"
            });
        });

        describe("Add", () => {
            it(": should support basic add.", () => {
                var patcher = new yamlPatcher.YamlPatcher([
                    { 
                        op: "add", path: "/added", value: {}
                    },{
                        op: "add", path: "/added/value", value: "42" 
                    }
                ]);
                var result = jsYaml.safeLoad(patcher.apply(source));

                expect(result).toBeDefined();
                expect(result.sampleValue).toBeDefined();
                expect(result.sampleValue).toEqual("12");
                expect(result.added.value).toEqual("42");
            });
        });
    });
});
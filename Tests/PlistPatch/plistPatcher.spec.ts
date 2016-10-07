import plistPatcher = require("../../Tasks/PlistPatch/plistPatcher");
var plist = require("../../Tasks/PlistPatch/node_modules/plist");



describe("PLIST Patcher", () => {

    describe("Operations", () => {
    
        var source: string;

        beforeEach(function() {
            source = plist.build({
                sampleValue : "12"
            });
        });

        describe("Add", () => {
            it(": should support basic add.", () => {
                var patcher = new plistPatcher.PlistPatcher([
                    { 
                        op: "add", path: "/added", value: {}
                    },{
                        op: "add", path: "/added/value", value: "42" 
                    }
                ]);
                var result = plist.parse(patcher.apply(source));

                expect(result).toBeDefined();
                expect(result.sampleValue).toBeDefined();
                expect(result.sampleValue).toEqual("12");
                expect(result.added.value).toEqual("42");
            });
        });
    });
});
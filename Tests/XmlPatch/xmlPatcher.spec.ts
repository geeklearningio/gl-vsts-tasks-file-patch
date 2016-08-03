import xmlatcher = require("../../Tasks/XmlPatch/xmlPatcher");

describe("XML Patcher", () => {

    describe("Operations", () => {

        var source: string;

        beforeEach(function () {
            source = '<rootNode><name>a name</name><childNode size="10"><leaf color="#aaaaaa"/><leaf color="#000000"/></childNode></rootNode>';
        });

        describe("Add", () => {
            it(": should support basic add.", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/newNode", value: "10"
                    }, {
                        op: "add", path: "/rootNode/newNode/@newAttribute", value: "42"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><name>a name</name><childNode size="10"><leaf color="#aaaaaa"/><leaf color="#000000"/></childNode><newNode newAttribute="42">10</newNode></rootNode>');
            });
        });


        describe("Replace", () => {
            it(": should support basic attribute replace.", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "replace", path: "/rootNode/childNode/@size", value: "42"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><name>a name</name><childNode size="42"><leaf color="#aaaaaa"/><leaf color="#000000"/></childNode></rootNode>');
            });
            
            it(": should support basic node content replace.", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "replace", path: "/rootNode/name", value: "a new name"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><name>a new name</name><childNode size="10"><leaf color="#aaaaaa"/><leaf color="#000000"/></childNode></rootNode>');
            });
        });

        describe("Move", () => {
            it(": should support attribute move with tests.", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "move", from: "/rootNode/childNode/@size", path: "/rootNode/childNode/leaf[@color='#000000']/@size"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><name>a name</name><childNode><leaf color="#aaaaaa"/><leaf color="#000000" size="10"/></childNode></rootNode>');
            });
        });

        describe("Remove", () => {
            it(": should support remove node with tests.", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "remove", path: "/rootNode/childNode/leaf[@color='#000000']"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><name>a name</name><childNode size="10"><leaf color="#aaaaaa"/></childNode></rootNode>');
            });

            it(": should support remove attribute with tests.", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "remove", path: "/rootNode/childNode/leaf[@color='#000000']/@color"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><name>a name</name><childNode size="10"><leaf color="#aaaaaa"/><leaf/></childNode></rootNode>');
            });
        });
    });
});
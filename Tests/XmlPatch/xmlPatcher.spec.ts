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

    describe("Array operation tests", () => {
        var source: string;
        
        beforeEach(function () {
            source = '<rootNode><leaf color="#aaaaaa"/><leaf color="#000000"/></rootNode>';
        });

        describe("Add", () => {
            it(": should prepend", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/0", value: "leaf"
                    },{
                        op: "replace", path: "/rootNode/leaf:first()/@color", value: "#bbbbbb"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#bbbbbb"/><leaf color="#aaaaaa"/><leaf color="#000000"/></rootNode>');
            });

            it(": should add at index", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/1", value: "leaf"
                    },{
                        op: "replace", path: "/rootNode/leaf[1]/@color", value: "#bbbbbb"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"/><leaf color="#bbbbbb"/><leaf color="#000000"/></rootNode>');
            });

            it(": should append", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/-", value: "leaf"
                    },{
                        op: "replace", path: "/rootNode/leaf:last()/@color", value: "#bbbbbb"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"><leaf color="#000000"/><leaf color="#bbbbbb"/></rootNode>');
            });
        });

        describe("Replace", () => {
            it(": replace at index", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "replace", path: "/rootNode/1", value: "otherleaf"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"/><otherleaf/></rootNode>');
            });
        });

        describe("Move", () => {
            it(": move at index", () => {
                     var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "move", from: "/rootNode/0", path: "/rootNode/1", value: "otherleaf"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#000000"/><leaf color="#aaaaaa"/></rootNode>');
            });
        });

        describe("Delete", () => {
            it(": delete at index", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "delete", path: "/rootNode/1"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#000000"/></rootNode>');
            });

            it(": delete first", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "delete", path: "/rootNode/0"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"/></rootNode>');
            });

            it(": delete last", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "delete", path: "/rootNode/-"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#000000"/></rootNode>');
            });
        });
    });

    describe("Regression tests", () => {
        it(": test #22 find by attribute value is working properly", () => {
            var source =    '<?xml version="1.0" encoding="utf-8"?> \
                            <configuration> \
                            <connectionStrings> \
                                <add name="db" connectionString="Data Source=local_dev;Database=Internal_DEV;Type System Version=SQL Server 2012;User ID=someone;Password=something;Persist Security Info=True" providerName="System.Data.SqlClient" /> \
                                <add name="example" connectionString="Data Source=xx;Database=xx;Type System Version=SQL Server 2012;User ID=xx;Password=xx;Persist Security Info=True" providerName="System.Data.SqlClient" /> \
                            </connectionStrings> \
                            <appSettings> \
                                <!-- Specify a super user name, for example \
                                <add key="SuperUser" value="US\jshkolnik" /> \
                                --> \
                                <add key="SuperUser" value="#should_be_replaced#" /> \
                            </appSettings> \
                            </configuration>';
             var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "replace", path: "/configuration/appSettings/add[@key='SuperUser']/@value", value : "a value"
                    }
                ], {});
             var result = patcher.apply(source);
             expect(result).not.toContain('#should_be_replaced#');
        });
    });
});
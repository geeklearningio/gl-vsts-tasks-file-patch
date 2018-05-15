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

            it(": should support basic add to properties at once.", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/newNode", value: { "@name": "aname", "@value": "avalue"}
                    }, 
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><name>a name</name><childNode size="10"><leaf color="#aaaaaa"/><leaf color="#000000"/></childNode><newNode name="aname" value="avalue"/></rootNode>');
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
                    }, {
                        op: "replace", path: "/rootNode/leaf[1]/@color", value: "#bbbbbb"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#bbbbbb"/><leaf color="#aaaaaa"/><leaf color="#000000"/></rootNode>');
            });

            it(": should prepend", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/0", value: "myns:anode"
                    }, {
                        op: "replace", path: "/rootNode/myns:anode[1]/@color", value: "#bbbbbb"
                    }
                ], {"myns" : "http://example.com"});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><myns:anode color="#bbbbbb" xmlns:myns="http://example.com"/><leaf color="#aaaaaa"/><leaf color="#000000"/></rootNode>');
            });

            it(": should prepend and set attributes from an object", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/0", value: "leaf"
                    }, {
                        op: "replace", path: "/rootNode/leaf[1]", value: { "@color": "#bbbbbb" }
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#bbbbbb"/><leaf color="#aaaaaa"/><leaf color="#000000"/></rootNode>');
            });

            it(": should add at index", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/1", value: "leaf"
                    }, {
                        op: "replace", path: "/rootNode/leaf[2]/@color", value: "#bbbbbb"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"/><leaf color="#bbbbbb"/><leaf color="#000000"/></rootNode>');
            });

            it(": should append", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "/rootNode/-", value: "leaf"
                    }, {
                        op: "replace", path: "/rootNode/leaf[last()]/@color", value: "#bbbbbb"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"/><leaf color="#000000"/><leaf color="#bbbbbb"/></rootNode>');
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
            xit(": move at index", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "move", from: "/rootNode/0", path: "/rootNode/1"
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
                        op: "remove", path: "/rootNode/1"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"/></rootNode>');
            });

            it(": delete first", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "remove", path: "/rootNode/0"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#000000"/></rootNode>');
            });

            it(": delete last", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "remove", path: "/rootNode/-"
                    }
                ], {});
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode><leaf color="#aaaaaa"/></rootNode>');
            });
        });
    });

    describe("Namespaced tests", () => {
        var source: string;
        var namespaces: { [key: string]: string };

        beforeEach(function () {
            namespaces = { "myns": "http://example.com" };
            source = '<rootNode xmlns="http://example.com"></rootNode>';
        });

        describe("Add", () => {
            it(": should support basic add with default namespace", () => {
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "myns:rootNode/myns:newNode", value: "10"
                    }
                ], namespaces);
                var result = patcher.apply(source);

                expect(result).toEqual('<rootNode xmlns="http://example.com"><newNode>10</newNode></rootNode>');
            });
            

            it(": should support basic add with explicit namespace", () => {
                source = '<myns:rootNode xmlns:myns="http://example.com"></myns:rootNode>';
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "myns:rootNode/myns:newNode", value: "10"
                    }
                ], namespaces);
                var result = patcher.apply(source);

                expect(result).toEqual('<myns:rootNode xmlns:myns="http://example.com"><myns:newNode>10</myns:newNode></myns:rootNode>');
            });

            it(": should support basic add with explicit namespace but different tag in xpath", () => {
                source = '<mynsorig:rootNode xmlns:mynsorig="http://example.com"></mynsorig:rootNode>';
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "myns:rootNode/myns:newNode", value: "10"
                    }
                ], namespaces);
                var result = patcher.apply(source);

                expect(result).toEqual('<mynsorig:rootNode xmlns:mynsorig="http://example.com"><mynsorig:newNode>10</mynsorig:newNode></mynsorig:rootNode>');
            });

            it(": should support attribute namespace", () => {
                source = '<myns:rootNode xmlns:myns="http://example.com"></myns:rootNode>';
                var patcher = new xmlatcher.XmlPatcher([
                    {
                        op: "add", path: "myns:rootNode/myns:newNode", value: { "@myns:attr" : "10"}
                    }
                ], namespaces);
                var result = patcher.apply(source);

                expect(result).toEqual('<myns:rootNode xmlns:myns="http://example.com"><myns:newNode myns:attr="10"/></myns:rootNode>');
            });
        });

    });

    describe("Regression tests", () => {
        it(": test #22 find by attribute value is working properly", () => {
            var source = '<?xml version="1.0" encoding="utf-8"?> \
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
                    op: "replace", path: "/configuration/appSettings/add[@key='SuperUser']/@value", value: "a value"
                }
            ], {});
            var result = patcher.apply(source);
            expect(result).not.toContain('#should_be_replaced#');
        });

        it(": test #22 replace a node which does not exists should operate as a successful add operation", () => {
            var source = `<Project Sdk="Microsoft.NET.Sdk.Web">
                                <PropertyGroup>
                                    <TargetFramework>netcoreapp1.1</TargetFramework>
                                    <DebugType>portable</DebugType>
                                    <PreserveCompilationContext>true</PreserveCompilationContext>
                                    <AssemblyName>A.Assembly.Name</AssemblyName>
                                    <OutputType>Exe</OutputType>
                                    <PackageId>A.Assembly.Name</PackageId>
                                    <PackageTargetFallback>$(PackageTargetFallback);portable-net45+win8;dnxcore50</PackageTargetFallback>
                                    <TypeScriptCompileBlocked>True</TypeScriptCompileBlocked>
                                </PropertyGroup>

                                <ItemGroup>
                                    <!--Files not to show in IDE-->
                                    <Content Remove="wwwroot\lib_node_modules\**" />
                                    <Content Remove="node_modules\**" />
                                    <None Update="Views\**\*">
                                    <CopyToPublishDirectory>PreserveNewest</CopyToPublishDirectory>
                                    </None>
                                </ItemGroup>
                            </Project>`;
            var patcher = new xmlatcher.XmlPatcher([
                {
                    op: "replace", path: "/Project/PropertyGroup/VersionPrefix", value: "#a_version#"
                }
            ], {});
            var result = patcher.apply(source);
            expect(result).toContain('#a_version#');
        });

        it(": test #40", () => {
            var source = `<?xml version="1.0" encoding="UTF-8"?>
                            <RunSettings>
                            <TestRunParameters>

                                <Parameter name="dbRestoreSource"                value="snapshot" />

                                <Parameter name="webServer"                      value="RPZMV961527" />
                                <Parameter name="dbServer"                       value="RPZMV961527" />
                                <Parameter name="dbInstanceName"                 value="" />
                                <Parameter name="dbUsername"                     value="" />
                                <Parameter name="dbPassword"                     value="" />
                                <Parameter name="testBrowser"                    value="chrome" />
                                <Parameter name="testOutDir"                     value="00_satlogs\" />

                                <Parameter name="applicationRootDirectory"       value="." />
                                <Parameter name="applicationPath"                value=".\; .\Release\; .\Debug\" />

                            </TestRunParameters>

                            <RunConfiguration>
                                <ResultsDirectory>.\tst</ResultsDirectory>
                            </RunConfiguration>
                            <MSTest>
                                <DeleteDeploymentDirectoryAfterTestRunIsComplete>False</DeleteDeploymentDirectoryAfterTestRunIsComplete>
                                <DeploymentEnabled>False</DeploymentEnabled>
                                <SettingsFile>.\AutomatedCodedUI.testsettings</SettingsFile>
                                <!--<ForcedLegacyMode>true</ForcedLegacyMode>-->
                                <AssemblyResolution>
                                <Directory Path="%ProgramFiles%\Microsoft Visual Studio 14.0\Common7\IDE\PublicAssemblies\" includeSubDirectories="true" />
                                <Directory Path="%ProgramFiles%\Microsoft Visual Studio 14.0\Common7\IDE\PrivateAssemblies\" includeSubDirectories="true" />
                                </AssemblyResolution>
                            </MSTest>
                            </RunSettings>
                            `;

            var patcher = new xmlatcher.XmlPatcher([
                {
                    op: "replace", path: "//Parameter[@name='testOutDir']/@value", value: "#an_outDir#"
                },
                {
                    op: "replace", path: "//Parameter[@name='applicationRootDirectory']/@value", value: "#an_appRoot#"
                }
            ], {});
            var result = patcher.apply(source);
            expect(result).toContain('#an_outDir#');
            expect(result).toContain('#an_appRoot#');
        });
    });
});
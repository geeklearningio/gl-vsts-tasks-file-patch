/**
 * Created by autex on 5/31/2016.
 */
"use strict"

import patch = require("../../Tasks/JsonPatch/common/patch");

var str = '+ /test/whatever/toto =>   "42"\n= /test/whatever/toto/grade => 0\n- /test/whatever/toto/t=> 0\n? /test/whatever/toto/ => "toto"\n&/test/copy/titi => /toto/target/grosminet\n> /test/copy/titi => /toto/target/grosminet';

describe("Whistespace support", () => {
    it(": whitespaces can be safely added anywhere.", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('  +    /test/whatever \t => "42" ');
        expect(patches.length).toEqual(1);
        expect(patches[0].op).toEqual('add');
        expect(patches[0].path).toEqual('/test/whatever');
        expect((<any>patches[0]).value).toEqual('42');
    });

    it(": mutiline is supported", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('+    /test/whatever \t => "42" \n - /test/whatever/toto/t \n+    /test/answer \t => "42"');
        expect(patches.length).toEqual(3);
        expect(patches[0].op).toEqual('add');
        expect(patches[0].path).toEqual('/test/whatever');
        expect((<any>patches[0]).value).toEqual('42');

        expect(patches[1].op).toEqual('remove');
        expect(patches[1].path).toEqual('/test/whatever/toto/t');

        expect(patches[2].op).toEqual('add');
        expect(patches[2].path).toEqual('/test/answer');
        expect((<any>patches[2]).value).toEqual('42');
    });
});

describe("Add operation", () => {
    it("an add operation is properly parsed", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('+/test/whatever=>"42"');
        expect(patches.length).toEqual(1);
        expect(patches[0].op).toEqual('add');
        expect(patches[0].path).toEqual('/test/whatever');
        expect((<any>patches[0]).value).toEqual('42');
    });
});

describe("Remove operation", () => {
    it("an remove operation is properly parsed", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('-/test/whatever=>"42"');
        expect(patches.length).toEqual(1);
        expect(patches[0].op).toEqual('remove');
        expect(patches[0].path).toEqual('/test/whatever');
    });
});

describe("Replace operation", () => {
    it("an replace operation is properly parsed", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('=/test/whatever=>"42"');
        expect(patches.length).toEqual(1);
        expect(patches[0].op).toEqual('replace');
        expect(patches[0].path).toEqual('/test/whatever');
        expect((<any>patches[0]).value).toEqual('42');
    });
});

describe("move operation", () => {
    it("an move operation is properly parsed", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('>/test/whatever=>/target/whatever');
        expect(patches.length).toEqual(1);
        expect(patches[0].op).toEqual('move');
        expect((<any>patches[0]).from).toEqual('/test/whatever');
        expect(patches[0].path).toEqual('/target/whatever');
    });
});

describe("copy operation", () => {
    it("an copy operation is properly parsed", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('&/test/whatever=>/target/whatever');
        expect(patches.length).toEqual(1);
        expect(patches[0].op).toEqual('copy');
        expect((<any>patches[0]).from).toEqual('/test/whatever');
        expect(patches[0].path).toEqual('/target/whatever');
    });
});

describe("test operation", () => {
    it("an test operation is properly parsed", () => {
        var parser = new patch.SlickPatchParser();
        var patches = parser.parse('?/test/whatever=>"42"');
        expect(patches.length).toEqual(1);
        expect(patches[0].op).toEqual('test');
        expect(patches[0].path).toEqual('/test/whatever');
        expect((<any>patches[0]).value).toEqual('42');
    });
});

describe("Invalid Json", () => {
    it("a copy operation is properly parsed", () => {
        var parser = new patch.SlickPatchParser();
        var invalidJsonPatch = '=/test/whatever=>"dggkdg\\000t"';
        

        expect(() => {
            var patches = parser.parse(invalidJsonPatch);
        }).toThrowError(/Failed to parse/);
    });
});
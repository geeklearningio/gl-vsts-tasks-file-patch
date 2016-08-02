/**
 * Created by autex on 5/31/2016.
 */
"use strict"

var re = /^(\+|-|=|&|>|\?)\s*(.*?)\s*=>\s*(.*)$/gm; 
var str = '+ /test/whatever/toto =>   "42"\n= /test/whatever/toto/grade => 0\n- /test/whatever/toto/t=> 0\n? /test/whatever/toto/ => "toto"\n&/test/copy/titi => /toto/target/grosminet\n> /test/copy/titi => /toto/target/grosminet';


describe("A suite", function() {
    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });
});
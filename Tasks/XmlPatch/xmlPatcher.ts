import patch = require('./common/patch');
import xpath = require('xpath');
import xmldom = require('xmldom');
import XRegExp = require('xregexp');

export class XmlPatcher implements patch.IPatcher {
    constructor(
        private patches: patch.IPatch[],
        private namespaces: { [tag: string]: string }
    ) {

    }

    notfound(patch: patch.IPatch): boolean {
        console.log(patch.path + " was not found");
        return false;
    }

    remove(xml: any, select: any, patch: patch.IPatch): boolean {
        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            node.remove();
            return true;
        } else {
            return this.notfound(patch);
        }
    }

    move(xml: any, select: any, patch: patch.IPatch) : boolean {
        var fromNode = <SVGSVGElement>select(patch.from, xml, true);
        var toNode = <SVGSVGElement>select(patch.path, xml, true);
        if (fromNode) {
            patch.value = fromNode.textContent;
            fromNode.remove();
            return this.replace(xml, select, patch);
        } else {
            return this.notfound(patch);
        }
    }

    copy(xml: any, select: any, patch: patch.IPatch) : boolean {
        var fromNode = <SVGSVGElement>select(patch.from, xml, true);
        var toNode = <SVGSVGElement>select(patch.path, xml, true);
         if (fromNode) {
            patch.value = fromNode.textContent;
            return this.replace(xml, select, patch);
        } else {
            return this.notfound(patch);
        }
    }

    add(xml: any, select: any, patch: patch.IPatch) : boolean {
        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            return false;
        } else {
            this.notfound(patch);
        }
    }

    replace(xml: any, select: any, patch: patch.IPatch) : boolean {
        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            node.textContent = patch.value;
            return true;
        } else {
            return this.add(xml, select, patch);
        }
    }

    test(xml: any, select: any, patch: patch.IPatch) : boolean {
        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node && node.textContent == patch.value) {
            return true;
        } else {
            return false;
        }
    }

    apply(content: string): string {
        var xml = new xmldom.DOMParser().parseFromString(content);
        var select = xpath.useNamespaces(this.namespaces);
        for (var index = 0; index < this.patches.length; index++) {
            var patch = this.patches[index];
            var operation: (xml: any, select: any, patch: patch.IPatch) => boolean = (xml, select, patch) => false;
            if (patch.op == 'replace') {
                operation = this.replace;
            } else if (patch.op == 'add') {
                operation = this.add;
            } else if (patch.op == 'remove') {
                operation = this.remove;
            } else if (patch.op == 'copy') {
                operation = this.copy;
            } else if (patch.op == 'move') {
                operation = this.move;
            } else if (patch.op == 'test') {
                operation = this.test;
            }
            if (!operation(xml, select, patch)){
                throw new Error("Failed to patch xml file");
            }
        }
        return new xmldom.XMLSerializer().serializeToString(xml);
    }
}

export function loadNamespaces(map: string): { [tag: string]: string } {
    var result: { [tag: string]: string } = {};

    XRegExp.forEach(map, /^(?<tag>.*?)\s*=>\s*(?<uri>.*?)\s*?$/gm, (match) => {
        result[(<any>match).tag] = (<any>match).uri;
    });

    return result;
}
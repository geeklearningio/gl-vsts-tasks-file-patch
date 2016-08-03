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

    getParentPath(path: string): { path: string, nodeName: string, isAttribute: boolean } {
        var lastSlash = path.lastIndexOf('/');
        var nodeName = path.substr(lastSlash + 1);
        var isAttribute = nodeName[0] == '@';
        return {
            path: path.substr(0, lastSlash),
            nodeName: isAttribute ? nodeName.substr(1) : nodeName,
            isAttribute: isAttribute
        };
    }

    notfound(patch: patch.IPatch): boolean {
        console.log(patch.path + " was not found");
        return false;
    }

    remove(xml: Document, select: any, patch: patch.IPatch): boolean {
        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            var parentPath = this.getParentPath(patch.path);
            var parentNode = <SVGSVGElement>select(parentPath.path, xml, true);
            if (parentPath.isAttribute){
                parentNode.removeAttribute(parentPath.nodeName);
            } else {
                node.parentNode.removeChild(node);
            }
            return true;
        } else {
            return this.notfound(patch);
        }
    }

    move(xml: Document, select: any, patch: patch.IPatch): boolean {
        var fromNode = <SVGSVGElement>select(patch.from, xml, true);
        var toNode = <SVGSVGElement>select(patch.path, xml, true);
        if (fromNode) {
            patch.value = fromNode.textContent;
            this.remove(xml, select, { op: 'remove', path : patch.from });
            return this.replace(xml, select, patch);
        } else {
            return this.notfound(patch);
        }
    }

    copy(xml: Document, select: any, patch: patch.IPatch): boolean {
        var fromNode = <SVGSVGElement>select(patch.from, xml, true);
        var toNode = <SVGSVGElement>select(patch.path, xml, true);
        if (fromNode) {
            patch.value = fromNode.textContent;
            return this.replace(xml, select, patch);
        } else {
            return this.notfound(patch);
        }
    }

    add(xml: Document, select: any, patch: patch.IPatch): boolean {
        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            node.textContent = patch.value;
            return true;
        } else {
            var lastSlash = patch.path.lastIndexOf('/');
            var parentPath = patch.path.substr(0, lastSlash);
            var newNodeName = patch.path.substr(lastSlash + 1);
            node = <SVGSVGElement>select(parentPath, xml, true);
            if (node) {
                if (newNodeName[0] == '@') {
                    node.setAttribute(newNodeName.substr(1), patch.value);
                    return true;
                } else {
                    var newNode = xml.createElement(newNodeName);
                    newNode.textContent = patch.value;
                    node.appendChild(newNode);
                    return true;
                }
            } else {
                return this.notfound(patch);
            }
        }
    }

    replace(xml: Document, select: any, patch: patch.IPatch): boolean {
        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            var parentPath = this.getParentPath(patch.path);
            var parentNode = <SVGSVGElement>select(parentPath.path, xml, true);
            if (parentPath.isAttribute){
                parentNode.setAttribute(parentPath.nodeName, patch.value);
            } else {
                 node.textContent = patch.value;
            }
            return true;
        } else {
            return this.add(xml, select, patch);
        }
    }

    test(xml: Document, select: any, patch: patch.IPatch): boolean {
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
                operation = this.replace.bind(this);
            } else if (patch.op == 'add') {
                operation = this.add.bind(this);
            } else if (patch.op == 'remove') {
                operation = this.remove.bind(this);
            } else if (patch.op == 'copy') {
                operation = this.copy.bind(this);
            } else if (patch.op == 'move') {
                operation = this.move.bind(this);
            } else if (patch.op == 'test') {
                operation = this.test.bind(this);
            }
            if (!operation(xml, select, patch)) {
                throw new Error("Failed to patch xml file");
            }
        }
        return new xmldom.XMLSerializer().serializeToString(xml);
    }
}

export function loadNamespaces(map: string): { [tag: string]: string } {
    var result: { [tag: string]: string } = {};

    XRegExp.forEach(map, XRegExp('^\\s*(?<tag>.*?)\\s*=>\\s*(?<uri>.*?)\\s*?$', 'gm'), (match) => {
        result[(<any>match).tag] = (<any>match).uri;
    });

    return result;
}
import patch = require('./common/patch');
import xpath = require('xpath');
import xmldom = require('xmldom');
import XRegExp = require('xregexp');
import { Operation } from 'fast-json-patch';
import { ENGINE_METHOD_ECDH, ENETDOWN } from 'constants';

interface IPatch {
    op: string;
    path: string;
    value?: any;
    from?: string;
}

export class XmlPatcher implements patch.IPatcher {
    constructor(
        public patches: Operation[],
        private namespaces: { [tag: string]: string }
    ) {
    }

    public createNode(xml: Document, parsedName: { name: string, namespace: string | null, localName: string }) {
        let newNode: Element;

        if (parsedName.namespace) {
            newNode = xml.createElementNS(parsedName.namespace, parsedName.name);

        } else {
            newNode = xml.createElement(parsedName.localName);
        }

        return newNode;
    }

    private transformObject(xml: Document, obj: any, target: Element) {
        if (typeof obj === 'object') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const element = obj[key];
                    if (key[0] === '@') {
                        target.setAttribute(key.substr(1), element);
                    } else {
                        let node = this.createNode(xml, this.detectNamespace(xml, key));
                        target.appendChild(node);
                        this.transformObject(xml, element, node);
                    }
                }
            }
        } else {
            target.textContent = obj;
        }
    }

    private detectArrayOperation(path: string): { path: string, isArrayOperation: boolean, append?: boolean, index?: number } {
        var lastSlash = path.lastIndexOf('/');
        var lastFragment = path.substr(lastSlash + 1);
        var remainingPath = path.substr(0, lastSlash);

        if (lastFragment == '-') {
            return {
                path: remainingPath,
                isArrayOperation: true,
                append: true
            };
        }

        var isLastFragmentDigitOnly: string[] = XRegExp.match(lastFragment, /^\d+$/g);
        if (isLastFragmentDigitOnly.length > 0) {
            return {
                path: remainingPath,
                isArrayOperation: true,
                index: parseInt(lastFragment)
            };
        }

        return {
            path: path,
            isArrayOperation: false
        };
    }

    private detectNamespace(xml: Document, nodeName: string): { name: string, namespace: string | null, localName: string } {
        var colon = nodeName.lastIndexOf(':');

        if (colon > 0) {
            const namespace = this.namespaces[nodeName.substr(0, colon)];
            const localName = nodeName.substr(colon + 1);

            const defaultNamespace = xml.documentElement.lookupNamespaceURI('');
            const existingPrefix = xml.documentElement.lookupPrefix(namespace);


            if (defaultNamespace === namespace) {
                return {
                    name: localName,
                    namespace: namespace,
                    localName: localName
                };
            } else if (existingPrefix !== null) {
                return {
                    name: existingPrefix + ':' + localName,
                    namespace: namespace,
                    localName: localName
                };
            } else {
                return {
                    name: nodeName,
                    namespace: namespace,
                    localName: nodeName.substr(colon + 1)
                };
            }
        }

        return {
            name: nodeName,
            namespace: null,
            localName: nodeName
        };
    }

    private getParentPath(path: string): { path: string, nodeName: string, isAttribute: boolean } {
        var lastSlash = path.lastIndexOf('/');
        var nodeName = path.substr(lastSlash + 1);
        var isAttribute = nodeName[0] == '@';
        return {
            path: path.substr(0, lastSlash),
            nodeName: isAttribute ? nodeName.substr(1) : nodeName,
            isAttribute: isAttribute
        };
    }

    private notfound(patch: IPatch): boolean {
        console.log(patch.path + " was not found");
        return false;
    }

    private notsupported(patch: IPatch): boolean {
        console.log("operation not supported: " + patch.op + " " + patch.path);
        return false;
    }

    private remove(xml: Document, select: any, patch: IPatch): boolean {
        var arrayOperation = this.detectArrayOperation(patch.path);
        if (arrayOperation.isArrayOperation) {
            if (arrayOperation.append) {
                var node = <SVGSVGElement>select(arrayOperation.path, xml, true);
                node.removeChild(node.lastChild);
                return true;
            } else {
                var node = <SVGSVGElement>select(arrayOperation.path, xml, true);
                node.removeChild(node.childNodes[arrayOperation.index]);
                return true;
            }
        }

        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            var parentPath = this.getParentPath(patch.path);
            var parentNode = <SVGSVGElement>select(parentPath.path, xml, true);
            if (parentPath.isAttribute) {
                parentNode.removeAttribute(parentPath.nodeName);
            } else {
                node.parentNode.removeChild(node);
            }
            return true;
        } else {
            return this.notfound(patch);
        }
    }

    private move(xml: Document, select: any, patch: IPatch): boolean {
        var arrayOperation = this.detectArrayOperation(patch.path);
        var arrayOperationFrom = this.detectArrayOperation(patch.from);
        if (arrayOperation.isArrayOperation || arrayOperationFrom.isArrayOperation) {
            return this.notsupported(patch);
        } else {
            var fromNode = <SVGSVGElement>select(patch.from, xml, true);
            var toNode = <SVGSVGElement>select(patch.path, xml, true);
            if (fromNode) {
                patch.value = fromNode.textContent;
                this.remove(xml, select, { op: 'remove', path: patch.from });
                return this.replace(xml, select, patch);
            } else {
                return this.notfound(patch);
            }
        }
    }

    private copy(xml: Document, select: any, patch: IPatch): boolean {
        var fromNode = <SVGSVGElement>select(patch.from, xml, true);
        var toNode = <SVGSVGElement>select(patch.path, xml, true);
        if (fromNode) {
            patch.value = fromNode.textContent;
            return this.replace(xml, select, patch);
        } else {
            return this.notfound(patch);
        }
    }

    private add(xml: Document, select: any, patch: IPatch): boolean {
        let arrayOperation = this.detectArrayOperation(patch.path);
        if (arrayOperation.isArrayOperation) {
            let parsedName = this.detectNamespace(xml, patch.value);
            if (arrayOperation.append) {
                let node = <SVGSVGElement>select(arrayOperation.path, xml, true);
                let newNode = this.createNode(xml, parsedName);
                node.appendChild(newNode);
                return true;
            } else {
                let node = <SVGSVGElement>select(arrayOperation.path, xml, true);
                let newNode = this.createNode(xml, parsedName);
                node.insertBefore(newNode, node.childNodes[arrayOperation.index])
                return true;
            }
        }

        var node = <SVGSVGElement>select(patch.path, xml, true);
        if (node) {
            this.transformObject(xml, patch.value, node);
            //node.textContent = patch.value;
            return true;
        } else {
            var lastSlash = patch.path.lastIndexOf('/');
            var parentPath = patch.path.substr(0, lastSlash);
            var newNodeName = patch.path.substr(lastSlash + 1);
            var parsedName = this.detectNamespace(xml, newNodeName);
            node = <SVGSVGElement>select(parentPath, xml, true);
            if (node) {
                if (newNodeName[0] == '@') {
                    let attributeName = this.detectNamespace(xml, newNodeName);
                    if (attributeName.namespace) {
                        node.setAttributeNS(attributeName.namespace, attributeName.name, patch.value);
                    } else {
                        node.setAttribute(newNodeName.substr(1), patch.value);
                    }
                    return true;
                } else {
                    let newNode = this.createNode(xml, parsedName);
                    this.transformObject(xml, patch.value, newNode);
                    //newNode.textContent =  patch.value;
                    node.appendChild(newNode);
                    return true;
                }
            } else {
                return this.notfound(patch);
            }
        }
    }

    private replace(xml: Document, select: any, patch: IPatch): boolean {
        var arrayOperation = this.detectArrayOperation(patch.path);
        if (arrayOperation.isArrayOperation) {
            var node = <SVGSVGElement>select(arrayOperation.path, xml, true);
            var childNode = node.childNodes[arrayOperation.index];
            var newNode = this.createNode(xml, this.detectNamespace(xml, patch.value));
            node.insertBefore(newNode, childNode)
            node.removeChild(childNode);
            return true;
        } else {
            var node = <SVGSVGElement>select(patch.path, xml, true);
            if (node) {
                var parentPath = this.getParentPath(patch.path);
                var parentNode = <SVGSVGElement>select(parentPath.path, xml, true);
                if (parentPath.isAttribute) {
                    parentNode.setAttribute(parentPath.nodeName, patch.value);
                } else {
                    this.transformObject(xml, patch.value, node);
                    //node.textContent = patch.value;
                }
                return true;
            } else {
                return this.add(xml, select, patch);
            }
        }
    }

    private test(xml: Document, select: any, patch: IPatch): boolean {
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
            var operation: (xml: any, select: any, patch: Operation) => boolean = (xml, select, patch) => false;
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
![Icon](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/blob/master/Extension/extension-icon.png)

# File Patch Build and Release Tasks

![cistatus](https://geeklearning.visualstudio.com/_apis/public/build/definitions/f841b266-7595-4d01-9ee1-4864cf65aa73/39/badge)

Visual Studio Team Services Build and Release Management extensions that help you update files using JSON patch and similar syntax.

[Learn more](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki) about this extension on the wiki!

## Tasks included

* **[Patch JSON Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-JSON-Files)**: Patch JSON files using JSON patch syntax
* **[Patch XML Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-XML-Files)**: Patch XML files using XPath and JSON patch syntaxes
* **[Patch YAML Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-YAML-Files)**: Patch YAML files using JSON patch syntax
* **[Patch PLIST Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-PLIST-Files)**: Patch PLIST files using JSON patch syntax

## To contribute

1. Globally install typescript and tfx-cli (to package VSTS extensions): `npm install -g typescript tfx-cli`
2. From the root of the repo run `npm install`. This will pull down the necessary modules for the different tasks and for the build tools.
3. Run `npm run build` to compile the build tasks.
4. Run `npm run package -- --version <version>` to create the .vsix extension packages (supports multiple environments) that includes the build tasks.

## Release Notes

> **10-9-2016**
> - Added: Patch PLIST File
> - Improved: Patch JSON File with JSON5 parser support and JSON5 output support.

> **10-7-2016**
> - Added: Patch YAML File

> **8-3-2016**
> - Added: Patch JSON File
> - Added: Patch XML File

## Contributors

This extension was created by [Geek Learning](http://geeklearning.io/), with help from the community.

## Attributions

* [Bandages by Paulo Sá Ferreira from the Noun Project](https://thenounproject.com/term/bandages/437437/)

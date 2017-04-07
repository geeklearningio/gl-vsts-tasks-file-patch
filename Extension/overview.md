# Build and release tasks for File Patch

Visual Studio Team Services Build and Release Management extensions that help you update files using JSON patch and similar syntax.

[Learn more](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki) about this extension on the wiki!

## Tasks included

* **[Patch JSON Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-JSON-Files)**: Patch JSON files using JSON patch syntax
* **[Patch XML Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-XML-Files)**: Patch XML files using XPath and JSON patch syntaxes
* **[Patch YAML Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-YAML-Files)**: Patch YAML files using JSON patch syntax
* **[Patch PLIST Files](https://github.com/geeklearningio/gl-vsts-tasks-file-patch/wiki/Patch-PLIST-Files)**: Patch PLIST files using JSON patch syntax

## Steps

After installing the extension, you can add one (or more) of the tasks to a new or existing [build definition](https://www.visualstudio.com/en-us/docs/build/define/create) or [release definition](https://www.visualstudio.com/en-us/docs/release/author-release-definition/more-release-definition)

![add-task](Screenshots/Add-Tasks.png)

## Learn more

The [source](https://github.com/geeklearningio/gl-vsts-tasks-file-patch) for this extension is on GitHub. Take, fork, and extend.

## Release Notes

> **07-4-2017**
> - Improved logs
> - Added options to control the behavior when patch can't be applied or no file are patched.

> **10-9-2016**
> - Added: Patch PLIST File
> - Improved: Patch JSON File with JSON5 parser support and JSON5 output support.

> **10-7-2016**
> - Added: Patch YAML File

> **8-3-2016**
> - Added: Patch JSON File
> - Added: Patch XML File

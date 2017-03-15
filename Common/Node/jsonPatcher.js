"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonPatch = require('fast-json-patch');
var JsonPatcher = (function () {
    function JsonPatcher(patches) {
        this.patches = patches;
    }
    JsonPatcher.prototype.parse = function (content) {
        return JSON.parse(content);
    };
    JsonPatcher.prototype.stringify = function (content) {
        return JSON.stringify(content);
    };
    JsonPatcher.prototype.apply = function (content) {
        var json = this.parse(content);
        var prevalidate = jsonPatch.validate(this.patches, json);
        var result = jsonPatch.apply(json, this.patches, false);
        if (result) {
            return this.stringify(json);
        }
        else {
            throw new Error('Failed to apply patch');
        }
    };
    return JsonPatcher;
}());
exports.JsonPatcher = JsonPatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvblBhdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqc29uUGF0Y2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRTNDO0lBQ0kscUJBQ1ksT0FBdUI7UUFBdkIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7SUFFbkMsQ0FBQztJQUVTLDJCQUFLLEdBQWYsVUFBZ0IsT0FBZTtRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRVMsK0JBQVMsR0FBbkIsVUFBb0IsT0FBWTtRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsMkJBQUssR0FBTCxVQUFNLE9BQWU7UUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO1FBQzVDLENBQUM7SUFDTCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLGtDQUFXIn0=
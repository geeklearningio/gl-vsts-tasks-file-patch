import jsonPatcher = require("./common/jsonPatcher");
import { Operation } from "fast-json-patch";

import JSON5 = require("json5");

export class Json5Patcher extends jsonPatcher.JsonPatcher {
  constructor(patches: Operation[], private outputJson5: boolean) {
    super(patches);
  }

  parse(content: string): any {
    return JSON5.parse(content);
  }

  stringify(content: any): string {
    if (this.outputJson5) {
      return JSON5.stringify(content, null, 4);
    } else {
      return super.stringify(content);
    }
  }
}

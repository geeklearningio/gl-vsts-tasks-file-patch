import patch = require('./patch');
export declare class JsonPatcher implements patch.IPatcher {
  private patches;
  public constructor(patches: patch.IPatch[]);
  protected parse(content: string): any;
  protected stringify(content: any): string;
  public apply(content: string): string;
}

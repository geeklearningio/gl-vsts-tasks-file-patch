export interface IPatch {
  op: string;
  path: string;
  value?: any;
  from?: string;
}
export interface IPatcher {
  apply(content: string): string;
}
export declare class SlickPatchParser {
  parse(sourcePatch: string): IPatch[];
}

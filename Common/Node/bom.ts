var bomRegex = /^\uFEFF/;

export interface IBomDetectResult {
  hadBOM: boolean;
  content: string;
}

export function removeBom(content: string): IBomDetectResult {
  var hasBomMatch = content.match(bomRegex);
  var hasBom = hasBomMatch && hasBomMatch.length > 0;
  return {
    hadBOM: hasBom,
    content: hasBom ? content.replace(bomRegex, '') : content
  };
}

export function restoreBom(file: IBomDetectResult): string {
  if (file.hadBOM) {
    return '\uFEFF' + file.content;
  }
  return file.content;
}

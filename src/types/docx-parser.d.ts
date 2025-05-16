declare module 'docx-parser' {
  export function parseDocx(buffer: Buffer): Promise<string>;
} 
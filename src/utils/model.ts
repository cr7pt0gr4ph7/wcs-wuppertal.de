export function parseImageObject(imagePathOrObj: string | { src: string, alt?: string }, opts?: { alt?: string }): { src: string, alt?: string };
export function parseImageObject(imagePathOrObj: string | { src: string, alt?: string } | undefined, opts?: { alt?: string }): { src: string, alt?: string } | undefined;

export function parseImageObject(imagePathOrObj: string | { src: string, alt?: string } | undefined, opts?: { alt?: string }): { src: string, alt?: string } | undefined {
  if (imagePathOrObj === undefined) {
    return undefined;
  } else if (typeof imagePathOrObj === "string") {
    return { src: imagePathOrObj, alt: opts?.alt };
  } else {
    return { alt: opts?.alt, ...imagePathOrObj };
  }
}

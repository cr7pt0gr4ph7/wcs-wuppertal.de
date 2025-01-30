import type { GetImageResult } from "astro";

type SrcSetValue = GetImageResult["srcSet"]["values"][number]

export function toImageSet(image: {
    srcSet: {
        values: SrcSetValue[];
        attribute: string;
    }
}, forceAttributes: string[]): string {
    let result = "image-set(";
    for (let i = 0; i < forceAttributes.length && i < image.srcSet.values.length; i++) {
        if (i > 0) {
            result += ", ";
        }
        result += 'url(';
        result += image.srcSet.values[i].url;
        result += ')';
        result += " ";
        result += forceAttributes[i];
    }
    result += ")"
    return result;
}

import type { GetImageResult } from "astro";
import type { LocalImageProps, RemoteImageProps } from "astro:assets";

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


export function isLocalImage(src: string): boolean {
    return src.indexOf("https://") === -1 && src.indexOf("http://") === -1;
}

export type ImageSpec = {
    src: string,
    alt?: string
};

export type _LocalImageProps = {
    src: ImageMetadata | Promise<{default: ImageMetadata }>;
    alt: string;
}

export type _RemoteImageProps = {
    src: string;
    alt: string;
    inferSize: true;
}

export type ImageProps = _LocalImageProps | _RemoteImageProps;

export function toImageProps(image: ImageSpec | undefined): ImageProps | null {
    if (image && image.src) {
        if (isLocalImage(image.src)) {
            const normalizedPath = image.src.startsWith("/") ? image.src : "/" + image.src;
            const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/*.{jpeg,jpg,png,gif}');
            if (!images[normalizedPath]) {
                throw new Error(`"${image.src}" does not exist in glob: "src/assets/*.{jpeg,jpg,png,gif}"`);
            }
            return {
                src: images[normalizedPath](),
                alt: image.alt ?? "",
            };
        } else {
            return {
                src: image.src,
                alt: image.alt ?? "",
                inferSize: true as const,
            };
        }
    } else {
        return null;
    }
}

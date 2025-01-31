import { hyphenateSync as hyphenateSyncDe } from "hyphen/de";

export function hyphenate(text: string): string {
    return hyphenateSyncDe(text, {
        // Manual hyphenation rules. `-` marks a place
        // where a soft hyphen should be placed.
        exceptions: [
            "Sa-Ba-Swing",
            "Week-end"
        ]
    });
}

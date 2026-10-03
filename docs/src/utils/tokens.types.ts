export interface DesignToken {
    /** Custom property name, e.g. `--accent`. */
    name: string;
    /** Raw CSS value. */
    value: string;
    /** Trailing comment from tokens.css, if any. */
    note?: string;
}

export interface TokenGroup {
    /** Group heading from the comment above the tokens, e.g. `Core palette`. */
    name: string;
    tokens: DesignToken[];
}

/** Props of the `WebFrame` component. */
export interface WebFrameProps {
    /** Address of the page to show. Only `http:` and `https:` URLs are loaded. */
    url: string;
    /** Accessible name of the embedded page, also shown in the toolbar. @default the URL's host */
    title?: string;
    /**
     * Restrictions for the embedded page (the iframe `sandbox` attribute). Pass an empty string for
     * the strictest sandbox.
     * @default 'allow-scripts allow-same-origin allow-forms allow-popups'
     */
    sandbox?: string;
    /** Features the page may use (the iframe `allow` attribute), e.g. `'fullscreen; autoplay'`. */
    allow?: string;
    /** Shows the toolbar with address, reload and "open in new tab". @default true */
    toolbar?: boolean;
    /** Fixed height in px. Without it the frame fills the height of its container. */
    height?: number;
    /** Called when the page has loaded. */
    onLoad?: () => void;
    /** Additional class names for the root element. */
    className?: string;
}

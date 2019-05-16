type TriggerEvent = 'move' | 'end';
type props = Partial<{
    w: number;
    h: number;
    l: number;
    t: number;
}>;
type Config = Partial<{ 
    view: string;
    preview: string;
    file: string;
    error: (code: number) => void;
    size: number;
    maskWidth: number | string;
    maskHeight: number | string;
    minWidth: number;
    minHeight: number;
    outWidth: number;
    outHeight: number;
    Height: number;
    keepPP: boolean;
    type: string;
    name: string;
    blob: boolean;
    circle: boolean;
    event: TriggerEvent;
    quality: number;
    ext:string
}>;
type GetImageSizeCallback = (width: number, height: number) => void;
interface HTMLImageElement {
    ready(callback: GetImageSizeCallback): void;
}
interface Base {
    cfg: Config,
    view: HTMLElement;
    file: HTMLInputElement;
    mk: HTMLElement;
    img: HTMLImageElement;
    dot: HTMLElement;
    type: string;
    mp: props;
    ip: props;
    rp: props;
    vw: number;
    vh: number;
    kp: number;
    pmt: number;
    name?: string;
    preImage?: HTMLImageElement;
}
interface OnErrorEventHandlerNonNull {
    (event: Event | string, source?: string, lineno?: number, colno?: number, error?: any): any;
}

type Props = Partial<{
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
    isEnd: boolean;
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
    mp: Props; //mask props
    ip: Props; //image props
    rsp: Props; //restore props
    vw: number; //view width
    vh: number; //view height
    kp: number; 
    pmt: number;
    pv?:HTMLElement //previvew
    pi?: HTMLImageElement; //preview image
    in?:HTMLElement //preview inner
    pp?:Props; // preivew props
    pc?:Function
}
interface OnErrorEventHandlerNonNull {
    (event: Event | string, source?: string, lineno?: number, colno?: number, error?: any): any;
}

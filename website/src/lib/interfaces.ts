export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    path?: string;
    maxAge?: number;
    domain?: string;
}

export interface Particle {
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    size: number;
    isQRPixel: boolean;
    scatterX: number;
    scatterY: number;
}
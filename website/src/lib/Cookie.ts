import { CookieOptions } from "@/lib/interfaces"
import { serialize, parse } from "cookie"
import jwt from "jsonwebtoken"

export class Cookie {
    private secret: string

    constructor(secret: string) {
        this.secret = secret
    }

    public createSignedCookie(name: string, value: string, options: Partial<CookieOptions> = {}) : string {
        const token = jwt.sign({ value }, this.secret, { expiresIn: options.maxAge || "1h" })
        return  this.createCookie(name, token, options)
    }

    public getCookie(cookieHeader: string | undefined, name: string): string | null {
        const cookies = this.parseCookies(cookieHeader);
        return cookies[name] || null;
    }

    public verifySignedCookie(cookieHeader: string | undefined, name: string): string | null {
        const token = this.getCookie(cookieHeader, name);
        if (!token) return null;
        try {
            const decoded = jwt.verify(token, this.secret) as { value: string };
            return decoded.value;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return null;
        }
    }

    public deleteCookie(name: string): string {
        return serialize(name, "", { path: "/", maxAge: 0 });
    }

    private createCookie(name: string, value: string, options: Partial<CookieOptions> = {}) : string {
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            ...options
        }

        return serialize(name, value, cookieOptions)
    }

    private parseCookies(cookieHeader?: string): Record<string, string | undefined> {
        return cookieHeader ? parse(cookieHeader) : {};
    }
}
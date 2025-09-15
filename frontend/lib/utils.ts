import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 将 Base64URL 格式的字符串转换为 ArrayBuffer
 * WebAuthn 要求使用 Base64URL 格式而不是标准 Base64
 * @param base64 Base64URL 格式的字符串
 * @returns ArrayBuffer 对象
 */
export function base64ToArrayBuffer(base64: string) {
    // 将 Base64URL 转换为标准 Base64
    const binaryString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * 将 ArrayBuffer 转换为 Base64URL 格式的字符串
 * @param buffer ArrayBuffer 对象
 * @returns Base64URL 格式的字符串
 */
export function arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    // 将标准 Base64 转换为 Base64URL 格式
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

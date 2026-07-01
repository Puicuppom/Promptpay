import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const BLUE = '#00468C';
const BLUE_LIGHT = '#0066B8';
const WHITE = '#FFFFFF';

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const s = size;

    // พื้นหลัง gradient แบบ PromptPay
    const bg = ctx.createLinearGradient(0, 0, s, s);
    bg.addColorStop(0, '#003A75');
    bg.addColorStop(0.5, BLUE);
    bg.addColorStop(1, BLUE_LIGHT);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, s, s);

    // การ์ดขาวตรงกลาง
    const cardPad = s * 0.14;
    const cardR = s * 0.08;
    const cx = cardPad;
    const cy = cardPad * 0.85;
    const cw = s - cardPad * 2;
    const ch = s - cardPad * 1.7;

    ctx.fillStyle = WHITE;
    roundRect(ctx, cx, cy, cw, ch, cardR);
    ctx.fill();

    // QR finder patterns (3 มุม)
    const qrPad = s * 0.06;
    const fx = cx + qrPad;
    const fy = cy + qrPad;
    const fw = cw - qrPad * 2;
    const fh = ch - qrPad * 2 - s * 0.11;
    const mod = Math.max(3, Math.floor(Math.min(fw, fh) / 9));

    drawFinder(ctx, fx, fy, mod);
    drawFinder(ctx, fx + fw - mod * 7, fy, mod);
    drawFinder(ctx, fx, fy + fh - mod * 7, mod);

    // จุด QR กลาง
    ctx.fillStyle = BLUE;
    const mx = fx + fw * 0.38;
    const my = fy + fh * 0.38;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (r === 1 && c === 1) continue;
            ctx.fillRect(mx + c * mod * 1.1, my + r * mod * 1.1, mod * 0.85, mod * 0.85);
        }
    }

    // แถบ THAI QR ด้านล่างการ์ด
    const barY = cy + ch - s * 0.002;
    const barH = s * 0.1;
    ctx.fillStyle = BLUE;
    ctx.fillRect(cx, barY, cw, barH);

    // สัญลักษณ์ ฿ บนพื้นน้ำเงิน
    ctx.fillStyle = WHITE;
    ctx.font = `bold ${s * 0.065}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('฿', cx + cw * 0.15, barY + barH / 2);

    // ขีดแทน "QR PAYMENT"
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    const lineY = barY + barH / 2;
    const lineX = cx + cw * 0.28;
    const lineW = cw * 0.62;
    ctx.fillRect(lineX, lineY - s * 0.008, lineW, s * 0.016);
    ctx.fillRect(lineX, lineY + s * 0.012, lineW * 0.65, s * 0.012);

    // ข้อความ "พร้อมเพย์" ใต้การ์ด
    ctx.fillStyle = WHITE;
    ctx.font = `bold ${s * 0.072}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('พร้อมเพย์', s / 2, cy + ch + s * 0.065);

    return canvas.toBuffer('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function drawFinder(ctx, x, y, mod) {
    const sz = mod * 7;
    ctx.fillStyle = BLUE;
    ctx.fillRect(x, y, sz, sz);
    ctx.fillStyle = WHITE;
    ctx.fillRect(x + mod, y + mod, mod * 5, mod * 5);
    ctx.fillStyle = BLUE;
    ctx.fillRect(x + mod * 2, y + mod * 2, mod * 3, mod * 3);
}

writeFileSync(join(root, 'apple-touch-icon.png'), drawIcon(180));
writeFileSync(join(root, 'icon-192.png'), drawIcon(192));
writeFileSync(join(root, 'icon-512.png'), drawIcon(512));
console.log('PromptPay icons generated');

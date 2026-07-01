import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const pad = Math.round(size * 0.15);
    const inner = size - pad * 2;

    ctx.fillStyle = '#00468C';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pad, pad, inner, inner);

    ctx.fillStyle = '#00468C';
    const u = Math.floor(inner / 7);
    const ox = pad + u;
    const oy = pad + u;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (r === 1 && c === 1) continue;
            ctx.fillRect(ox + c * u * 2, oy + r * u * 2, u, u);
        }
    }

    return canvas.toBuffer('image/png');
}

writeFileSync(join(root, 'apple-touch-icon.png'), drawIcon(180));
writeFileSync(join(root, 'icon-192.png'), drawIcon(192));
writeFileSync(join(root, 'icon-512.png'), drawIcon(512));
console.log('Icons generated');

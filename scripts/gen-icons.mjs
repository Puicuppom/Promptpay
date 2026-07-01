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

    const bg = ctx.createLinearGradient(0, 0, s, s);
    bg.addColorStop(0, '#003A75');
    bg.addColorStop(0.5, BLUE);
    bg.addColorStop(1, BLUE_LIGHT);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, s, s);

    ctx.fillStyle = WHITE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${s * 0.155}px sans-serif`;
    ctx.fillText('PromptPay', s / 2, s / 2);

    return canvas.toBuffer('image/png');
}

writeFileSync(join(root, 'apple-touch-icon.png'), drawIcon(180));
writeFileSync(join(root, 'icon-192.png'), drawIcon(192));
writeFileSync(join(root, 'icon-512.png'), drawIcon(512));
console.log('PromptPay icons generated');

/*
 * 2024 (c) MaoHuPi
 * complexFunctionMotion/src/render.mjs
 */

import Complex from "./complex.mjs";
import { hsl2rgb } from "./hslrgb.mjs";

const PI2 = Math.PI * 2;

export default function renderComplexFunction(cvs, ctx, func, x = 0, y = 0, pixelPerUnit = 1080) {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, cvs.width, cvs.height);

	let lengthLoopingDelta = 1e7;
	for (let r = 0; r < cvs.width; r++) {
		for (let i = 0; i < cvs.height; i++) {
			var reflection = func(new Complex((r - cvs.width / 2) / pixelPerUnit + x, -((i - cvs.height / 2) / pixelPerUnit + y)));
			// [re, im] = [column, -row], because of the y axis of canvas coordinate system is at the opposite direction of Cartesian coordinate system.

			/* domain coloring */
			ctx.fillStyle = `rgb(${hsl2rgb(
				Math.atan2(reflection.im, reflection.re) / PI2,
				100 / 100,
				reflection.len / (reflection.len + 1) % 1
			).join(', ')})`;

			ctx.fillRect(r, i, 1, 1);
		}
	}
}
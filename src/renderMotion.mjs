/*
 * 2024 (c) MaoHuPi
 * complexFunctionMotion/src/renderMotion.mjs
 */

import fs from 'node:fs';
import { createCanvas } from 'canvas';
import { execSync } from 'child_process';

import renderComplexFunction from './render.mjs';

function interpret(rate, [fromV, toV]) {
	return Math.max(
		Math.min(fromV, toV),
		Math.min(
			Math.max(fromV, toV),
			fromV * (1 - rate) + toV * (rate)
		)
	);
}
function rise(rate, [fromV, toV]) {
	return Math.max(
		Math.min(fromV, toV),
		Math.min(
			Math.max(fromV, toV),
			fromV * (toV / fromV) ** rate
		)
	);
}

function writeImage(name, cvs) {
	return new Promise((resolve) => {
		const out = fs.createWriteStream(name);
		const stream = cvs.createPNGStream();
		stream.pipe(out);
		out.on('finish', resolve);
	});
}

export default async function renderMotion({
	func,
	name = 'unknown',
	size = [1920, 1080],
	fps = 30,
	sec = 14.8,
	xRange = [0, 0],
	yRange = [0, 0],
	zRange = [1, 1e5],
	callMakeVideo = true
}) {
	let [fromX, toX] = xRange,
		[fromY, toY] = yRange,
		[fromZ, toZ] = zRange;
	const length = fps * sec;
	const cvs = createCanvas(...size),
		ctx = cvs.getContext('2d');

	if (!fs.existsSync(`./out/${name}/`)) fs.mkdirSync(`./out/${name}/`);

	for (let frame = 0; frame < length; frame++) {
		let rate = frame / length;
		renderComplexFunction(cvs, ctx, func,
			interpret(rate, [fromX, toX]),
			interpret(rate, [fromY, toY]),
			fromZ < toZ ? rise(rate, [fromZ, toZ]) : rise(1 - rate, [toZ, fromZ])
		);
		await writeImage(`./out/${name}/frame_${frame}.png`, cvs);
		console.log(`${Math.floor(rate * 100)}% ( ${frame} / ${length} )`);
	}

	if (callMakeVideo) execSync(`"./makeVideo.bat" "${name}" ${fps}`);
}

/* example:
let z_tetration_9 = z => Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, z)))))))));
await renderMotion({
	func: z_tetration_9,
	name: 'ZTetration9',
	size: [1920, 1080],
	fps: 30,
	sec: 14.8,
	xRange: [-0.3, -0.35],
	yRange: [0, 0],
	zRange: [1, 1e5]
});
*/
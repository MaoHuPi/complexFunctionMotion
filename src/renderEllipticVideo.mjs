/*
 * 2024 (c) MaoHuPi
 * complexFunctionMotion/src/renderEllipticVideo.mjs
 */

import fs from 'node:fs';
import { createCanvas, loadImage } from 'canvas';
import { execSync } from 'child_process';

import Complex from './complex.mjs';
import renderComplexFunction from './render.mjs';

let lambdaList = [];
let g = z => {
	let r = Complex.div(new Complex(1, 0), Complex.pow(z, new Complex(2, 0)));
	for (let lambda of lambdaList) {
		if (lambda) r = Complex.add(r, Complex.sub(Complex.div(new Complex(1, 0), Complex.pow(Complex.sub(z, lambda), new Complex(2, 0))), Complex.div(new Complex(1, 0), Complex.pow(lambda, new Complex(2, 0)))));
	}
	return r;
};

function writeImage(name, cvs) {
	return new Promise((resolve) => {
		const out = fs.createWriteStream(name);
		const stream = cvs.createPNGStream();
		stream.pipe(out);
		out.on('finish', resolve);
	});
}

async function renderFrame(name, frame, size, func) {
	const cvs = createCanvas(...size),
		ctx = cvs.getContext('2d');

	if (!fs.existsSync(`./out/${name}/`)) fs.mkdirSync(`./out/${name}/`);

	renderComplexFunction(cvs, ctx, func, 0, 0, 2e2);
	await writeImage(`./out/${name}/frame_${frame}.png`, cvs);
}

export default async function renderEllipticVideo({
	name = 'unknown',
	frameRange,
	oriImagePath,
	fps = 60, 
	sampleSize = [14, 10],
	renderSize = [960, 720],
	scale = 5,
	callback = message => { console.log(message); },
	callMakeVideo = true
}) {
	let [startFrame, stopFrame] = frameRange;
	for (let frame = startFrame; frame < stopFrame; frame++) {
		const cvs = createCanvas(...sampleSize),
			ctx = cvs.getContext('2d');
		let image = await loadImage(oriImagePath(frame));
		ctx.drawImage(image, 0, 0, ...sampleSize);
		let data = ctx.getImageData(0, 0, ...sampleSize).data;
		lambdaList = [];
		for (let r = 0; r < sampleSize[1]; r++) {
			for (let c = 0; c < sampleSize[0]; c++) {
				if (data[(r * sampleSize[0] + c) * 4] > 125) {
					lambdaList.push(new Complex((c / (sampleSize[0] - 1) - 0.5) * scale, (r / (sampleSize[1] - 1) - 0.5) * scale));
				}
			}
		}
		await renderFrame(name, frame, renderSize, g);
		callback(`{"type": "frame_rendered", "frame": ${frame}}`);
	}
	callback(`{"type": "done", "frame": -1}`);

	if (callMakeVideo) execSync(`"./makeVideo.bat" "${name}" ${fps}`);
}


/* example:
renderEllipticVideo({
	name: 'BadApple',
	frameRange: [1, 13144 + 1],
	oriImagePath: frame => `./out/BadApple/badAppleFrames/frame_${frame}.png`,
	fps: 60, 
	sampleSize: [14, 10],
	renderSize: [960, 720],
	scale: 5,
	callback: message => { console.log(message); },
	callMakeVideo: true
});
*/
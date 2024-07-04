/*
 * 2024 (c) MaoHuPi
 * complexFunctionMotion/src/renderColorMappingVideo.mjs
 */

import fs from 'node:fs';
import { createCanvas, loadImage } from 'canvas';
import { execSync } from 'child_process';
import { hsl2rgb, rgb2hsl } from "./hslrgb.mjs";

import Complex from './complex.mjs';

function writeImage(name, cvs) {
	return new Promise((resolve) => {
		const out = fs.createWriteStream(name);
		const stream = cvs.createPNGStream();
		stream.pipe(out);
		out.on('finish', resolve);
	});
}

const PI2 = 2 * Math.PI;
export default async function renderColorMappingVideo({
	name = 'unknown',
	func,
	frameRange,
	oriImagePath,
	fps = 60,
	callback = message => { console.log(message); },
	callMakeVideo = true,
	withPositionArgument = false
}) {
	let [startFrame, stopFrame] = frameRange;

	if (!fs.existsSync(`./out/${name}/`)) fs.mkdirSync(`./out/${name}/`);

	for (let frame = startFrame; frame < stopFrame; frame++) {
		const image = await loadImage(oriImagePath(frame));
		const cvs = createCanvas(image.width, image.height),
			ctx = cvs.getContext('2d');
		ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
		let imageData = ctx.getImageData(0, 0, cvs.width, cvs.height),
			data = imageData.data;
		for (let r = 0; r < cvs.height; r++) {
			for (let c = 0; c < cvs.width; c++) {
				let oriHsl = rgb2hsl(
					data[(r * cvs.width + c) * 4 + 0],
					data[(r * cvs.width + c) * 4 + 1],
					data[(r * cvs.width + c) * 4 + 2]
				);
				let oriComplex = Complex.fromPolar(oriHsl[2] / (1 - oriHsl[2]), oriHsl[0] * PI2);
				let reflection = withPositionArgument ? func(oriComplex, new Complex(c / cvs.width - 0.5, -(r / cvs.height - 0.5))) : func(oriComplex);
				// [re, im] = [column, -row], because of the y axis of canvas coordinate system is at the opposite direction of Cartesian coordinate system.
				[data[(r * cvs.width + c) * 4 + 0], data[(r * cvs.width + c) * 4 + 1], data[(r * cvs.width + c) * 4 + 2]] = hsl2rgb(
					Math.atan2(reflection.im, reflection.re) / PI2,
					100 / 100,
					reflection.len / (reflection.len + 1) % 1
				);
			}
		}
		ctx.putImageData(imageData, 0, 0);
		await writeImage(`./out/${name}/frame_${frame}.png`, cvs);
		callback(`{"type": "frame_rendered", "frame": ${frame}}`);
	}
	callback(`{"type": "done", "frame": -1}`);

	if (callMakeVideo) execSync(`"./makeVideo.bat" "${name}" ${fps}`);
}

/* example:
let f = z => Complex.sech(z);
renderColorMappingVideo({
	name: 'ColorMappingTest',
	func: f,
	frameRange: [1, 1 + 1],
	oriImagePath: frame => `./out/ColorMappingTest/cat.jpg`,
	callback: message => { console.log(message); },
	callMakeVideo: false
});
*/
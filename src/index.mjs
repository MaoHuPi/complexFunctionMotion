/*
 * 2024 (c) MaoHuPi
 * complexFunctionMotion/src/index.mjs
 */

import Complex from "./complex.mjs";
import renderMotion from "./renderMotion.mjs";
import renderEllipticVideo from "./renderEllipticVideo.mjs";
import renderColorMappingVideo from "./renderColorMappingVideo.mjs";

let tetration9 = z => Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, z)))))))));
await renderMotion({
	func: tetration9,
	name: 'Tetration9',
	size: [1920, 1080],
	fps: 1,
	sec: 1,
	xRange: [0, 0],
	yRange: [0, 0],
	zRange: [2e2, 2e2],
	callMakeVideo: false
});

/*
let f = z => Complex.pow(z, Complex.i);
await renderMotion({
	func: f,
	name: 'index',
	size: [1080, 1080],
	fps: 1,
	sec: 1,
	xRange: [0, 0],
	yRange: [0, 0],
	zRange: [2e2, 2e2], 
	callMakeVideo: false
});
*/
/*
 * 2024 (c) MaoHuPi
 * complexFunctionMotion/src/index.mjs
 */

import Complex from "./complex.mjs";
import renderMotion from "./renderMotion.mjs";
import renderEllipticVideo from "./renderEllipticVideo.mjs";
import renderColorMappingVideo from "./renderColorMappingVideo.mjs";

console.log('example: renderMotion ( z^z^z^z^z^z^z^z^z )');
let z_tetration_9 = z => Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, Complex.pow(z, z)))))))));
await renderMotion({
	func: z_tetration_9,
	name: 'ZTetration9',
	size: [1920, 1080],
	fps: 1,
	sec: 1,
	xRange: [-0.35, -0.35],
	yRange: [0, 0],
	zRange: [1e5, 1e5], 
	callMakeVideo: false
});

console.log('example: renderEllipticVideo ( BadApple )');
await renderEllipticVideo({
	name: 'BadApple',
	frameRange: [530, 530 + 1],
	oriImagePath: frame => `./out/BadApple/badAppleFrames/frame_${frame}.png`,
	sampleSize: [14, 10],
	renderSize: [960, 720],
	scale: 5,
	callback: message => { },
	callMakeVideo: false
});

console.log('example: renderColorMappingVideo ( MaoHuPi )');
let f = (z, p) => Complex.mul(Complex.conj(Complex.mul(Complex.pow(z, new Complex(2, 1)), Complex.pow(Complex.fromPolar(2 - p.len, p.ang), new Complex(2, 0)))), Complex.exp(Complex.mul(Complex.i, new Complex(Math.PI/2, 0))));
renderColorMappingVideo({
	name: 'MaoHuPi',
	func: f,
	frameRange: [1, 1 + 1],
	oriImagePath: frame => `./out/MaoHuPi/logo_MaoHuPi.jpg`,
	callback: message => { },
	callMakeVideo: false, 
	withPositionArgument: true
});
/*
 * 2024 (c) MaoHuPi
 * complexFunctionMotion/src/example.mjs
 */

import Complex from "./complex.mjs";
import renderMotion from "./renderMotion.mjs";
import renderEllipticVideo from "./renderEllipticVideo.mjs";
import renderColorMappingVideo from "./renderColorMappingVideo.mjs";

console.log('example: renderMotion ( crab )');
let powC = function (c1, c2) {
	let [rh1, th1] = [c1.len, c1.ang];
	let [re2, im2] = [c2.re, c2.im];
	return Complex.fromPolar(re2 * rh1 - im2 * th1, re2 * th1 + im2 * rh1);
}
let crab = z => powC(z, powC(z, powC(z, powC(z, powC(z, powC(z, powC(z, powC(z, powC(z, z)))))))));
await renderMotion({
	func: crab,
	name: 'Crab',
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
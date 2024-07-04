/*
* complex.js
* MaoHuPi (c) 2024
* v 1.1.1
*/

export default class Complex {
   static i = new this(0, 1);
   static E = new this(Math.E, 0);
   static PI = new this(Math.PI, 0);
   constructor(re = 0, im = 0) {
      this.re = re;
      this.im = im;
   }
   static fromPolar(rho, theta) {
      return new this(rho * Math.cos(theta), rho * Math.sin(theta));
   }
   static neg(c) {
      return new this(-c.re, -c.im);
   }
   static conj(c) {
      return new this(c.re, -c.im);
   }
   static add(c1, c2) {
      return new this(c1.re + c2.re, c1.im + c2.im);
   }
   static sub(c1, c2) {
      return new this(c1.re - c2.re, c1.im - c2.im);
   }
   static mul(c1, c2) {
      return new this(c1.re * c2.re - c1.im * c2.im, c1.im * c2.re + c1.re * c2.im);
   }
   static div(c1, c2) {
      var d = (c2.re ** 2 + c2.im ** 2);
      return new this((c1.re * c2.re + c1.im * c2.im) / d, (c1.im * c2.re - c1.re * c2.im) / d);
   }
   static pow(c1, c2) {
      let [rh1, th1] = [c1.len, c1.ang];
      let [re2, im2] = [c2.re, c2.im];
      // return this.fromPolar(re2 * rh1 - im2 * th1, re2 * th1 + im2 * rh1);
      return this.fromPolar(rh1 ** re2 * Math.exp(im2 * th1), re2 * th1 + im2 * Math.log(rh1));
   }
   static exp(c) {
      return this.pow(this.E, c);
   }
   static ln(c) {
      return new this(Math.log(c.len), c.ang);
   }
   static log(c) {
      return this.div(this.ln(c), this.ln(new this(10, 0)));
   }
   static sin(c) {
      return this.div(this.sub(this.exp(this.mul(c, new this(0, 1))), this.exp(this.mul(c, new this(0, -1)))), new this(0, 2));
   }
   static cos(c) {
      return this.div(this.add(this.exp(this.mul(c, new this(0, 1))), this.exp(this.mul(c, new this(0, -1)))), new this(2, 0));
   }
   static tan(c) {
      let exp_pic = this.exp(this.mul(c, new this(0, 1)));
      let exp_nic = this.exp(this.mul(c, new this(0, -1)));
      return this.div(this.sub(exp_pic, exp_nic), this.mul(this.add(exp_pic, exp_nic), new Complex(0, 1)));
   }
   static csc(c) {
      return this.div(new this(0, 2), this.sub(this.exp(this.mul(c, new this(0, 1))), this.exp(this.mul(c, new this(0, -1)))));
   }
   static sec(c) {
      return this.div(new this(2, 0), this.add(this.exp(this.mul(c, new this(0, 1))), this.exp(this.mul(c, new this(0, -1)))));
   }
   static cot(c) {
      let exp_pic = this.exp(this.mul(c, new this(0, 1)));
      let exp_nic = this.exp(this.mul(c, new this(0, -1)));
      return this.div(this.mul(this.add(exp_pic, exp_nic), new Complex(0, 1)), this.sub(exp_pic, exp_nic));
   }
   static sinh(c) {
      return this.div(this.sub(this.exp(c), this.exp(this.neg(c))), new this(2, 0));
   }
   static cosh(c) {
      return this.div(this.add(this.exp(c), this.exp(this.neg(c))), new this(2, 0));
   }
   static tanh(c) {
      let exp_pc = this.exp(c);
      let exp_nc = this.exp(this.neg(c));
      return this.div(this.sub(exp_pc, exp_nc), this.add(exp_pc, exp_nc));
   }
   static csch(c) {
      return this.div(new this(2, 0), this.sub(this.exp(c), this.exp(this.neg(c))));
   }
   static sech(c) {
      return this.div(new this(2, 0), this.add(this.exp(c), this.exp(this.neg(c))));
   }
   static coth(c) {
      let exp_pc = this.exp(c);
      let exp_nc = this.exp(this.neg(c));
      return this.div(this.add(exp_pc, exp_nc), this.sub(exp_pc, exp_nc));
   }
   get len() {
      return Math.sqrt(this.re ** 2 + this.im ** 2);
   }
   get ang() {
      return Math.atan2(this.im, this.re);
   }
}
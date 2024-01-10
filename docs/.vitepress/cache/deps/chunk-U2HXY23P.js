import {
  TmpVectors,
  Vector2,
  Vector3
} from "./chunk-ZYQT2WB4.js";

// node_modules/@babylonjs/core/Maths/math.vertexFormat.js
var PositionNormalVertex = class _PositionNormalVertex {
  /**
   * Creates a PositionNormalVertex
   * @param position the position of the vertex (defaut: 0,0,0)
   * @param normal the normal of the vertex (defaut: 0,1,0)
   */
  constructor(position = Vector3.Zero(), normal = Vector3.Up()) {
    this.position = position;
    this.normal = normal;
  }
  /**
   * Clones the PositionNormalVertex
   * @returns the cloned PositionNormalVertex
   */
  clone() {
    return new _PositionNormalVertex(this.position.clone(), this.normal.clone());
  }
};
var PositionNormalTextureVertex = class _PositionNormalTextureVertex {
  /**
   * Creates a PositionNormalTextureVertex
   * @param position the position of the vertex (defaut: 0,0,0)
   * @param normal the normal of the vertex (defaut: 0,1,0)
   * @param uv the uv of the vertex (default: 0,0)
   */
  constructor(position = Vector3.Zero(), normal = Vector3.Up(), uv = Vector2.Zero()) {
    this.position = position;
    this.normal = normal;
    this.uv = uv;
  }
  /**
   * Clones the PositionNormalTextureVertex
   * @returns the cloned PositionNormalTextureVertex
   */
  clone() {
    return new _PositionNormalTextureVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
  }
};

// node_modules/@babylonjs/core/Maths/sphericalPolynomial.js
var SH3ylmBasisConstants = [
  Math.sqrt(1 / (4 * Math.PI)),
  -Math.sqrt(3 / (4 * Math.PI)),
  Math.sqrt(3 / (4 * Math.PI)),
  -Math.sqrt(3 / (4 * Math.PI)),
  Math.sqrt(15 / (4 * Math.PI)),
  -Math.sqrt(15 / (4 * Math.PI)),
  Math.sqrt(5 / (16 * Math.PI)),
  -Math.sqrt(15 / (4 * Math.PI)),
  Math.sqrt(15 / (16 * Math.PI))
  // l22
];
var SH3ylmBasisTrigonometricTerms = [
  () => 1,
  (direction) => direction.y,
  (direction) => direction.z,
  (direction) => direction.x,
  (direction) => direction.x * direction.y,
  (direction) => direction.y * direction.z,
  (direction) => 3 * direction.z * direction.z - 1,
  (direction) => direction.x * direction.z,
  (direction) => direction.x * direction.x - direction.y * direction.y
  // l22
];
var applySH3 = (lm, direction) => {
  return SH3ylmBasisConstants[lm] * SH3ylmBasisTrigonometricTerms[lm](direction);
};
var SHCosKernelConvolution = [Math.PI, 2 * Math.PI / 3, 2 * Math.PI / 3, 2 * Math.PI / 3, Math.PI / 4, Math.PI / 4, Math.PI / 4, Math.PI / 4, Math.PI / 4];
var SphericalHarmonics = class _SphericalHarmonics {
  constructor() {
    this.preScaled = false;
    this.l00 = Vector3.Zero();
    this.l1_1 = Vector3.Zero();
    this.l10 = Vector3.Zero();
    this.l11 = Vector3.Zero();
    this.l2_2 = Vector3.Zero();
    this.l2_1 = Vector3.Zero();
    this.l20 = Vector3.Zero();
    this.l21 = Vector3.Zero();
    this.l22 = Vector3.Zero();
  }
  /**
   * Adds a light to the spherical harmonics
   * @param direction the direction of the light
   * @param color the color of the light
   * @param deltaSolidAngle the delta solid angle of the light
   */
  addLight(direction, color, deltaSolidAngle) {
    TmpVectors.Vector3[0].set(color.r, color.g, color.b);
    const colorVector = TmpVectors.Vector3[0];
    const c = TmpVectors.Vector3[1];
    colorVector.scaleToRef(deltaSolidAngle, c);
    c.scaleToRef(applySH3(0, direction), TmpVectors.Vector3[2]);
    this.l00.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(1, direction), TmpVectors.Vector3[2]);
    this.l1_1.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(2, direction), TmpVectors.Vector3[2]);
    this.l10.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(3, direction), TmpVectors.Vector3[2]);
    this.l11.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(4, direction), TmpVectors.Vector3[2]);
    this.l2_2.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(5, direction), TmpVectors.Vector3[2]);
    this.l2_1.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(6, direction), TmpVectors.Vector3[2]);
    this.l20.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(7, direction), TmpVectors.Vector3[2]);
    this.l21.addInPlace(TmpVectors.Vector3[2]);
    c.scaleToRef(applySH3(8, direction), TmpVectors.Vector3[2]);
    this.l22.addInPlace(TmpVectors.Vector3[2]);
  }
  /**
   * Scales the spherical harmonics by the given amount
   * @param scale the amount to scale
   */
  scaleInPlace(scale) {
    this.l00.scaleInPlace(scale);
    this.l1_1.scaleInPlace(scale);
    this.l10.scaleInPlace(scale);
    this.l11.scaleInPlace(scale);
    this.l2_2.scaleInPlace(scale);
    this.l2_1.scaleInPlace(scale);
    this.l20.scaleInPlace(scale);
    this.l21.scaleInPlace(scale);
    this.l22.scaleInPlace(scale);
  }
  /**
   * Convert from incident radiance (Li) to irradiance (E) by applying convolution with the cosine-weighted hemisphere.
   *
   * ```
   * E_lm = A_l * L_lm
   * ```
   *
   * In spherical harmonics this convolution amounts to scaling factors for each frequency band.
   * This corresponds to equation 5 in "An Efficient Representation for Irradiance Environment Maps", where
   * the scaling factors are given in equation 9.
   */
  convertIncidentRadianceToIrradiance() {
    this.l00.scaleInPlace(SHCosKernelConvolution[0]);
    this.l1_1.scaleInPlace(SHCosKernelConvolution[1]);
    this.l10.scaleInPlace(SHCosKernelConvolution[2]);
    this.l11.scaleInPlace(SHCosKernelConvolution[3]);
    this.l2_2.scaleInPlace(SHCosKernelConvolution[4]);
    this.l2_1.scaleInPlace(SHCosKernelConvolution[5]);
    this.l20.scaleInPlace(SHCosKernelConvolution[6]);
    this.l21.scaleInPlace(SHCosKernelConvolution[7]);
    this.l22.scaleInPlace(SHCosKernelConvolution[8]);
  }
  /**
   * Convert from irradiance to outgoing radiance for Lambertian BDRF, suitable for efficient shader evaluation.
   *
   * ```
   * L = (1/pi) * E * rho
   * ```
   *
   * This is done by an additional scale by 1/pi, so is a fairly trivial operation but important conceptually.
   */
  convertIrradianceToLambertianRadiance() {
    this.scaleInPlace(1 / Math.PI);
  }
  /**
   * Integrates the reconstruction coefficients directly in to the SH preventing further
   * required operations at run time.
   *
   * This is simply done by scaling back the SH with Ylm constants parameter.
   * The trigonometric part being applied by the shader at run time.
   */
  preScaleForRendering() {
    this.preScaled = true;
    this.l00.scaleInPlace(SH3ylmBasisConstants[0]);
    this.l1_1.scaleInPlace(SH3ylmBasisConstants[1]);
    this.l10.scaleInPlace(SH3ylmBasisConstants[2]);
    this.l11.scaleInPlace(SH3ylmBasisConstants[3]);
    this.l2_2.scaleInPlace(SH3ylmBasisConstants[4]);
    this.l2_1.scaleInPlace(SH3ylmBasisConstants[5]);
    this.l20.scaleInPlace(SH3ylmBasisConstants[6]);
    this.l21.scaleInPlace(SH3ylmBasisConstants[7]);
    this.l22.scaleInPlace(SH3ylmBasisConstants[8]);
  }
  /**
   * update the spherical harmonics coefficients from the given array
   * @param data defines the 9x3 coefficients (l00, l1-1, l10, l11, l2-2, l2-1, l20, l21, l22)
   * @returns the spherical harmonics (this)
   */
  updateFromArray(data) {
    Vector3.FromArrayToRef(data[0], 0, this.l00);
    Vector3.FromArrayToRef(data[1], 0, this.l1_1);
    Vector3.FromArrayToRef(data[2], 0, this.l10);
    Vector3.FromArrayToRef(data[3], 0, this.l11);
    Vector3.FromArrayToRef(data[4], 0, this.l2_2);
    Vector3.FromArrayToRef(data[5], 0, this.l2_1);
    Vector3.FromArrayToRef(data[6], 0, this.l20);
    Vector3.FromArrayToRef(data[7], 0, this.l21);
    Vector3.FromArrayToRef(data[8], 0, this.l22);
    return this;
  }
  /**
   * update the spherical harmonics coefficients from the given floats array
   * @param data defines the 9x3 coefficients (l00, l1-1, l10, l11, l2-2, l2-1, l20, l21, l22)
   * @returns the spherical harmonics (this)
   */
  updateFromFloatsArray(data) {
    Vector3.FromFloatsToRef(data[0], data[1], data[2], this.l00);
    Vector3.FromFloatsToRef(data[3], data[4], data[5], this.l1_1);
    Vector3.FromFloatsToRef(data[6], data[7], data[8], this.l10);
    Vector3.FromFloatsToRef(data[9], data[10], data[11], this.l11);
    Vector3.FromFloatsToRef(data[12], data[13], data[14], this.l2_2);
    Vector3.FromFloatsToRef(data[15], data[16], data[17], this.l2_1);
    Vector3.FromFloatsToRef(data[18], data[19], data[20], this.l20);
    Vector3.FromFloatsToRef(data[21], data[22], data[23], this.l21);
    Vector3.FromFloatsToRef(data[24], data[25], data[26], this.l22);
    return this;
  }
  /**
   * Constructs a spherical harmonics from an array.
   * @param data defines the 9x3 coefficients (l00, l1-1, l10, l11, l2-2, l2-1, l20, l21, l22)
   * @returns the spherical harmonics
   */
  static FromArray(data) {
    const sh = new _SphericalHarmonics();
    return sh.updateFromArray(data);
  }
  // Keep for references.
  /**
   * Gets the spherical harmonics from polynomial
   * @param polynomial the spherical polynomial
   * @returns the spherical harmonics
   */
  static FromPolynomial(polynomial) {
    const result = new _SphericalHarmonics();
    result.l00 = polynomial.xx.scale(0.376127).add(polynomial.yy.scale(0.376127)).add(polynomial.zz.scale(0.376126));
    result.l1_1 = polynomial.y.scale(0.977204);
    result.l10 = polynomial.z.scale(0.977204);
    result.l11 = polynomial.x.scale(0.977204);
    result.l2_2 = polynomial.xy.scale(1.16538);
    result.l2_1 = polynomial.yz.scale(1.16538);
    result.l20 = polynomial.zz.scale(1.34567).subtract(polynomial.xx.scale(0.672834)).subtract(polynomial.yy.scale(0.672834));
    result.l21 = polynomial.zx.scale(1.16538);
    result.l22 = polynomial.xx.scale(1.16538).subtract(polynomial.yy.scale(1.16538));
    result.l1_1.scaleInPlace(-1);
    result.l11.scaleInPlace(-1);
    result.l2_1.scaleInPlace(-1);
    result.l21.scaleInPlace(-1);
    result.scaleInPlace(Math.PI);
    return result;
  }
};
var SphericalPolynomial = class _SphericalPolynomial {
  constructor() {
    this.x = Vector3.Zero();
    this.y = Vector3.Zero();
    this.z = Vector3.Zero();
    this.xx = Vector3.Zero();
    this.yy = Vector3.Zero();
    this.zz = Vector3.Zero();
    this.xy = Vector3.Zero();
    this.yz = Vector3.Zero();
    this.zx = Vector3.Zero();
  }
  /**
   * The spherical harmonics used to create the polynomials.
   */
  get preScaledHarmonics() {
    if (!this._harmonics) {
      this._harmonics = SphericalHarmonics.FromPolynomial(this);
    }
    if (!this._harmonics.preScaled) {
      this._harmonics.preScaleForRendering();
    }
    return this._harmonics;
  }
  /**
   * Adds an ambient color to the spherical polynomial
   * @param color the color to add
   */
  addAmbient(color) {
    TmpVectors.Vector3[0].copyFromFloats(color.r, color.g, color.b);
    const colorVector = TmpVectors.Vector3[0];
    this.xx.addInPlace(colorVector);
    this.yy.addInPlace(colorVector);
    this.zz.addInPlace(colorVector);
  }
  /**
   * Scales the spherical polynomial by the given amount
   * @param scale the amount to scale
   */
  scaleInPlace(scale) {
    this.x.scaleInPlace(scale);
    this.y.scaleInPlace(scale);
    this.z.scaleInPlace(scale);
    this.xx.scaleInPlace(scale);
    this.yy.scaleInPlace(scale);
    this.zz.scaleInPlace(scale);
    this.yz.scaleInPlace(scale);
    this.zx.scaleInPlace(scale);
    this.xy.scaleInPlace(scale);
  }
  /**
   * Updates the spherical polynomial from harmonics
   * @param harmonics the spherical harmonics
   * @returns the spherical polynomial
   */
  updateFromHarmonics(harmonics) {
    this._harmonics = harmonics;
    this.x.copyFrom(harmonics.l11);
    this.x.scaleInPlace(1.02333).scaleInPlace(-1);
    this.y.copyFrom(harmonics.l1_1);
    this.y.scaleInPlace(1.02333).scaleInPlace(-1);
    this.z.copyFrom(harmonics.l10);
    this.z.scaleInPlace(1.02333);
    this.xx.copyFrom(harmonics.l00);
    TmpVectors.Vector3[0].copyFrom(harmonics.l20).scaleInPlace(0.247708);
    TmpVectors.Vector3[1].copyFrom(harmonics.l22).scaleInPlace(0.429043);
    this.xx.scaleInPlace(0.886277).subtractInPlace(TmpVectors.Vector3[0]).addInPlace(TmpVectors.Vector3[1]);
    this.yy.copyFrom(harmonics.l00);
    this.yy.scaleInPlace(0.886277).subtractInPlace(TmpVectors.Vector3[0]).subtractInPlace(TmpVectors.Vector3[1]);
    this.zz.copyFrom(harmonics.l00);
    TmpVectors.Vector3[0].copyFrom(harmonics.l20).scaleInPlace(0.495417);
    this.zz.scaleInPlace(0.886277).addInPlace(TmpVectors.Vector3[0]);
    this.yz.copyFrom(harmonics.l2_1);
    this.yz.scaleInPlace(0.858086).scaleInPlace(-1);
    this.zx.copyFrom(harmonics.l21);
    this.zx.scaleInPlace(0.858086).scaleInPlace(-1);
    this.xy.copyFrom(harmonics.l2_2);
    this.xy.scaleInPlace(0.858086);
    this.scaleInPlace(1 / Math.PI);
    return this;
  }
  /**
   * Gets the spherical polynomial from harmonics
   * @param harmonics the spherical harmonics
   * @returns the spherical polynomial
   */
  static FromHarmonics(harmonics) {
    const result = new _SphericalPolynomial();
    return result.updateFromHarmonics(harmonics);
  }
  /**
   * Constructs a spherical polynomial from an array.
   * @param data defines the 9x3 coefficients (x, y, z, xx, yy, zz, yz, zx, xy)
   * @returns the spherical polynomial
   */
  static FromArray(data) {
    const sp = new _SphericalPolynomial();
    Vector3.FromArrayToRef(data[0], 0, sp.x);
    Vector3.FromArrayToRef(data[1], 0, sp.y);
    Vector3.FromArrayToRef(data[2], 0, sp.z);
    Vector3.FromArrayToRef(data[3], 0, sp.xx);
    Vector3.FromArrayToRef(data[4], 0, sp.yy);
    Vector3.FromArrayToRef(data[5], 0, sp.zz);
    Vector3.FromArrayToRef(data[6], 0, sp.yz);
    Vector3.FromArrayToRef(data[7], 0, sp.zx);
    Vector3.FromArrayToRef(data[8], 0, sp.xy);
    return sp;
  }
};

export {
  PositionNormalVertex,
  PositionNormalTextureVertex,
  SphericalHarmonics,
  SphericalPolynomial
};
//# sourceMappingURL=chunk-U2HXY23P.js.map

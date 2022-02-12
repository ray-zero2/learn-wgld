export default class Vector3 {
  static normalizeVector(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return [x/length, y/length, z/length];
  }

  constructor(x=0, y=0, z=0)  {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x, y, z) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.z = z ?? this.z;
  }

  get() {
    return [this.x, this.y, this.z];
  }

  get length() {
    return Math.hypot(this.x, this.y, this.z);
  }

  get array() {
    return [this.x, this.y, this.z];
  }

  /**
   * 
   * @returns { Vector3 }
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }

  /**
   * @param {Vector3} vector3
   */
  addVector(vector3) {
    this.x += vector3.x;
    this.y += vector3.y;
    this.z += vector3.z;
    return this;
  }

  /**
   * @param {number} scalar
   */
  addScalar(scalar) {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;
    return this;
  }

  /**
   * @param {Vector3} vector3
   */
  subVector(vector3) {
    this.x -= vector3.x;
    this.y -= vector3.y;
    this.z -= vector3.z;
    return this;
  }

   /**
   * @param {number} scalar
   */
  subScalar(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;
    return this;
  }

  /**
   * @param {Vector3} vector3
   */
  multiplyVector(vector3) {
    this.x *= vector3.x;
    this.y *= vector3.y;
    this.z *= vector3.z;
    return this;
  }

   /**
   * @param {number} scalar
   */
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  /**
   * @param {Vector3} vector3
   */
  divideVector(vector3) {
    this.x /= (vector3.x || 1);
    this.y /= (vector3.y || 1);
    this.z /= (vector3.z || 1);
    return this;
  }

 /**
   * @param {number} scalar
   */
  divideScalar(scalar) {
    const num = scalar || 1;
    this.x /= num;
    this.y /= num;
    this.z /= num;
    return this;
  }

  normalize() {
    this.divideScalar(this.length || 1);
    return this;
  }

  /**
   * ベクトルの内積
   * @param {Vector3} vecA 
   * @param {Vector3} vecB 
   * @returns {number}
   */
  dot(vecA, vecB = this) {
    return vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
  }

  cross(vecA, vecB) {
    if(!vecB) return this.#calcCross(this, vecA);
    else return this.#calcCross(vecA, vecB);
  }

  #calcCross(vecA, vecB) {
    const ax = vecA.x, ay = vecA.y, az = vecA.z;
    const bx = vecB.x, by = vecB.y, bz = vecB.z;

    const x = ay * bz - az * by;
    const y = az * bx - ax * bz;
    const z = ax * by - ay * bx;

    return new this.constructor(x, y, z);
  }
}
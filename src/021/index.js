import WebGLUtils from '../common/WebGLUtils';
import vertexShaderSource from './vertex.glsl?raw';
import fragmentShaderSource from './fragment.glsl?raw';
import Torus from './Torus';
import * as matIV from '../common/minMatrix';

export default class Index {
  constructor(canvasElement) {
    this.webGLUtils = new WebGLUtils(canvasElement);
    this.canvas = this.webGLUtils.canvas;
    this.gl = this.webGLUtils.gl;
    this.program = null;

    this.time = 0;
    this.torus = new Torus(2.0, 1, 32, 32, 2*Math.PI);
    console.log(this.torus);

    this.mMatrix = matIV.createMatrix();
    this.vMatrix = matIV.createMatrix();
    this.pMatrix = matIV.createMatrix();
    this.tmpMatrix = matIV.createMatrix();
    this.mvpMatrix = matIV.createMatrix();
    this.invMatrix = matIV.createMatrix();
  
    this.vbo = [];
    this.attLocation = [];
    this.attStride = [];
    this.ibo = [];
    this.uniLocation = [];
    this.uniType = [];

    this.ambientColor = [0.1, 0.1, 0.1, 1.0];

    this.lightDirection = [-0.5, 0.5, 0.5];
  }

  createProgram() {
    const utils = this.webGLUtils;
    const vertexShader = utils.createShader(vertexShaderSource, 'vertex');
    const fragmentShader = utils.createShader(fragmentShaderSource, 'fragment');
    const program = utils.createProgram(vertexShader, fragmentShader);
    return program;
  }

  setAttributes() {
    const gl = this.gl;
    const utils = this.webGLUtils;

    //position
    this.vbo.push(utils.createVbo(new Float32Array(this.torus.positions), gl.STATIC_DRAW));
    this.attLocation.push(gl.getAttribLocation(this.program, 'position'));
    this.attStride.push(3);

    // color
    this.vbo.push(utils.createVbo(new Float32Array(this.torus.colors), gl.STATIC_DRAW));
    this.attLocation.push(gl.getAttribLocation(this.program, 'color'));
    this.attStride.push(4);

    // normals
    this.vbo.push(utils.createVbo(new Float32Array(this.torus.normals), gl.STATIC_DRAW));
    this.attLocation.push(gl.getAttribLocation(this.program, 'normals'));
    this.attStride.push(3);

    // ibo
    this.ibo = this.webGLUtils.createIbo(this.torus.indices);
    this.webGLUtils.setAttribute(this.vbo, this.attLocation, this.attStride, this.ibo);
  }


  setUniforms() {
    const gl = this.gl;
    this.uniLocation.push(gl.getUniformLocation(this.program, 'time'));
    this.uniType.push('uniform1f');

    this.uniLocation.push(gl.getUniformLocation(this.program, 'modelMatrix'));
    this.uniType.push(null); // matrix4fvのため。

    this.uniLocation.push(gl.getUniformLocation(this.program, 'viewMatrix'));
    this.uniType.push(null); // matrix4fvのため。

    this.uniLocation.push(gl.getUniformLocation(this.program, 'projectionMatrix'));
    this.uniType.push(null); // matrix4fvのため。

    this.uniLocation.push(gl.getUniformLocation(this.program, 'invMatrix'));
    this.uniType.push(null);

    this.uniLocation.push(gl.getUniformLocation(this.program, 'ambientColor'));
    this.uniType.push(null);

    this.uniLocation.push(gl.getUniformLocation(this.program, 'lightDirection'));
    this.uniType.push(null);
  }

  setMatrixes() {
    matIV.lookAt([0.0, 0.0, 20.0], [0, 0, 0], [0, 1, 0], this.vMatrix);
	  matIV.perspective(45, this.canvas.width / this.canvas.height, 0.1, 100, this.pMatrix);
	  matIV.multiply(this.pMatrix, this.vMatrix, this.tmpMatrix);
  }

  setData() {
    this.setAttributes();
    this.setUniforms();
    this.setMatrixes();
  }

  setCanvasSize() {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  setup() {
    const gl = this.gl;
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.setCanvasSize();

    this.program = this.createProgram();
    if (!this.program) throw new Error('program object is not found');
    this.setData();

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.useProgram(this.program);
  }

  // resize() {
  //   this.setCanvasSize();
  // }

  // bind() {
  //   window.addEventListener('resize', this.resize.bind(this));
  // }

  render() {
    const speed = 0.4;
    const gl = this.gl;
    const utils = this.webGLUtils;
    const deltaTime = utils.getDeltaTime();
    this.time += deltaTime;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const rad = this.time * speed * Math.PI;
    matIV.identity(this.mMatrix);
		matIV.rotate(this.mMatrix, rad, [0, 1, 1], this.mMatrix);
		matIV.multiply(this.tmpMatrix, this.mMatrix, this.mvpMatrix);
		matIV.inverse(this.mMatrix, this.invMatrix);
    // this.gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation[1], false, this.mMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation[2], false, this.vMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation[3], false, this.pMatrix);
    this.gl.uniformMatrix4fv(this.uniLocation[4], false, this.invMatrix);
    this.gl.uniform4fv(this.uniLocation[5], this.ambientColor);
    this.gl.uniform3fv(this.uniLocation[6], this.lightDirection);
		gl.drawElements(gl.TRIANGLES, this.torus.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  animate() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }

  init() {
    this.setup();
    // this.bind();
    this.animate();
  }
}

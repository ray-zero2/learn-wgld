import {hsv2rgb} from '../common/hsv2rgb'
import Vector3 from '../common/Vector3';

export default class Torus {
  constructor(radius = 1, tube = 0.4, radialSegments = 8, tubularSegments = 6, arc = Math.PI * 2) {
    this.positions = [];
    this.colors = [];
    this.indices = [];
		this.uvs = [];
		this.normals = [];

    this.createGeometry(radius, tube, radialSegments, tubularSegments, arc);
  }

	createGeometry(radius, tube, radialSegments, tubularSegments, arc) {
		for(let i = 0; i <= radialSegments; i ++) {
			for(let j = 0; j <= tubularSegments; j++) {
				const u = j / tubularSegments * arc;
				const v = i / radialSegments * Math.PI * 2;

				const distanceFromCenter = radius + tube * Math.cos(v);
				const pipeX = distanceFromCenter * Math.cos(u);
				const pipeY = distanceFromCenter * Math.sin(u);
				const pipeZ = tube * Math.sin(v);
				const pipeVec = new Vector3(pipeX, pipeY, pipeZ);
				this.positions.push(...pipeVec.array);

				const color = hsv2rgb(u * 180 / Math.PI, 1, 1, 1);
				this.colors.push(color[0], color[1], color[2], color[3]);

				this.uvs.push( j / tubularSegments ); // uv.x
				this.uvs.push( i / radialSegments ); // uv.y

				const tubeCenterVec = new Vector3(radius * Math.cos(u), radius* Math.sin(u), 0);
				const normals = pipeVec.subVector(tubeCenterVec).normalize();
				this.normals.push(...normals.array);
			}
		}

		for ( let j = 1; j <= radialSegments; j ++ ) {
			for ( let i = 1; i <= tubularSegments; i ++ ) {
				const a = ( tubularSegments + 1 ) * j + i - 1;
				const b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
				const c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
				const d = ( tubularSegments + 1 ) * j + i;
				this.indices.push( a, b, d );
				this.indices.push( b, c, d );
			}
		}
	}
}
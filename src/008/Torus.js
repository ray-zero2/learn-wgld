import {hsv2rgb} from '../common/hsv2rgb'

export default class Torus {
  constructor(row, column, irad, orad) {
    this.positions = [];
    this.colors = [];
    this.indices = [];

    this.createGeometry(row, column, irad, orad);
  }

  createGeometry(row, column, irad, orad) {
    for(let i = 0; i <= row; i++){
			const r = Math.PI * 2 / row * i;
			const rr = Math.cos(r);
			const ry = Math.sin(r);

			for(let ii = 0; ii <= column; ii++){
				const tr = Math.PI * 2 / column * ii;
				const tx = (rr * irad + orad) * Math.cos(tr);
				const ty = ry * irad;
				const tz = (rr * irad + orad) * Math.sin(tr);
				this.positions.push(tx, ty, tz);

				const tc = hsv2rgb(360 / column * ii, 1, 1, 1);
				this.colors.push(tc[0], tc[1], tc[2], tc[3]);
			}
		}
		for(let i = 0; i < row; i++){
			for(let ii = 0; ii < column; ii++){
				const r = (column + 1) * i + ii;
				this.indices.push(r, r + column + 1, r + 1);
				this.indices.push(r + column + 1, r + column + 2, r + 1);
			}
		}
  }
}
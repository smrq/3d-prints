const fs = require('fs');
const path = require('path');
const { globals } = require('@smrq/openscad-js');

with (globals(x => eval(x))) {
	function cube_z0(x, y, z) {
		return translate([0, 0, z/2])(
			cube([x, y, z], { center: true })
		);
	}

	function linear_extrude_y(...keys) {
		return (...children) => (
			rotate([90, 0, 90])(
				linear_extrude(...keys)(...children)
			)
		);
	}

	function skewb(baseX, baseY, topX, topY, z) {
		return polyhedron([
			[-baseX / 2, -baseY / 2, 0],
			[ baseX / 2, -baseY / 2, 0],
			[ baseX / 2,  baseY / 2, 0],
			[-baseX / 2,  baseY / 2, 0],
			[ -topX / 2,  -topY / 2, z],
			[  topX / 2,  -topY / 2, z],
			[  topX / 2,   topY / 2, z],
			[ -topX / 2,   topY / 2, z],
		], [
			[0, 1, 2, 3],
			[7, 6, 5, 4],
			[1, 0, 4, 5],
			[2, 1, 5, 6],
			[3, 2, 6, 7],
			[0, 3, 7, 4],
		]);
	}

	function hypotenuse(a, b) {
		return Math.sqrt(a*a + b*b);
	}

	function hypotenuseInv(c, a) {
		return Math.sqrt(c*c - a*a);
	}

	function zip(...arrays) {
		const length = Math.max(...arrays.map(a => a.length));
		return [...Array(length)]
			.map((_, i) => arrays.map(a => a[i]));
	}

	function degToRad(deg) {
		return deg/180 * Math.PI;
	}

	function radToDeg(rad) {
		return rad/Math.PI * 180;
	}

	function writeFiles(files) {
		Object.entries(files).forEach(([name, src]) => {
			const filename = path.resolve(__dirname, '../../scad', name + '.scad');
			console.log(`Writing ${filename}`);
			fs.writeFileSync(filename, src, 'utf8');
		});
	}

	module.exports = {
		cube_z0,
		linear_extrude_y,
		skewb,
		hypotenuse,
		hypotenuseInv,
		zip,
		degToRad,
		radToDeg,
		writeFiles,
	};	
}

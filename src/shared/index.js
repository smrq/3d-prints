const fs = require('fs');
const path = require('path');
const { modules: {
	cube,
	linear_extrude,
	rotate,
	translate,
}} = require('@smrq/openscad-js');

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
	writeFiles,
};

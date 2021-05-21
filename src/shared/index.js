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

module.exports = {
	cube_z0,
	linear_extrude_y,
};

/**
  * Single-box storage for Codenames and Codenames Duet
  */

const { compile, globals } = require('@smrq/openscad-js');
const {
	cube_z0,
	linear_extrude_y,
	writeFiles
} = require('./shared');

with (globals(x => eval(x))) {
	const boxDimensions = { x: 154, y: 222, z: 50 };
	const rulebookWidth = 6;
	const boxHeightFull = boxDimensions.z - rulebookWidth;

	const baseKeyCardHolder = (() => {
		const frame = cube_z0(100, 73, boxHeightFull);
		const hourglassCutout = translate([0, 0, 10.5])(
			cube_z0(94, 21, boxHeightFull),
			rotate([0, 90, 0])(
				cylinder({ r: 10.5, h: 94, center: true })
			)
		);
		const cardCutout = cube_z0(68, 68, boxHeightFull);
		const gripCutout = cube_z0(25, 74, boxHeightFull);

		return difference()(
			frame,
			translate([0, 0, boxHeightFull-22])(hourglassCutout),
			translate([0, 0, boxHeightFull-(22+13)])(cardCutout),
			translate([0, 0, boxHeightFull-(22+13+3)])(gripCutout),
		);
	})();

	const duetKeyCardHolder = (() => {
		const frame = cube_z0(100, 68, boxHeightFull);
		const cardCutout = cube_z0(80, 63, boxHeightFull);
		const gripCutout = cube_z0(25, 69, boxHeightFull);

		return difference()(frame,
			translate([0, 0, boxHeightFull-35])(cardCutout),
			translate([0, 0, boxHeightFull-(35+3)])(gripCutout),
		);
	})();

	const mainCardHolder = (() => {
		const width = 122;
		const depth = 154;
		const height = boxHeightFull;
		const frameThickness = 2.5;
		const gripRadius = 6;
		const gripExtraDepth = 0.5;
		const pocketWidth = 23.5;
		const pocketHeight = 26;
		const heightOffset = 5;
		const angle = Math.atan2(14, height) * (180 / Math.PI);

		const frame = union()(
			cube([frameThickness, width, height]),
			translate([depth - frameThickness, 0, 0])(
				cube([frameThickness, width, height])
			),
			translate([75.75, 73, 0])(
				cube([frameThickness, 49, height])
			),
			translate([0, 71, 0])(
				cube([depth, 10, height])
			),
			linear_extrude_y({ height: depth })(
				polygon([[0, 0], [0, height], [1, height], [3, 0]])
			),
			translate([0, 81, 0])(
				linear_extrude_y({ height: depth })(
					polygon([[0, 0], [14, 0], [0, height]])
				)
			),
			translate([0, width, 0])(
				linear_extrude_y({ height: depth })(
					polygon([[0, 0], [-3, 0], [-1, height], [0, height]])
				)
			),
		);

		const pocket = pocketDepth => {
			const gripCylinderDepth = (pocketDepth - gripRadius) + gripExtraDepth;
			return rotate([angle, 0, 0])(
				translate([0, 0, heightOffset])(
					translate([0, -pocketDepth, 0])(
						cube([pocketWidth, pocketDepth, pocketHeight])
					),
					translate([0, -gripCylinderDepth, 0])(
						cube([pocketWidth, gripCylinderDepth, pocketHeight + gripRadius])
					),					
					translate([0, -gripCylinderDepth, pocketHeight])(
						rotate([0, 90, 0])(
							cylinder({ r: gripRadius, h: pocketWidth })
						)
					),
				)
			)
		};

		return difference()(
			frame,
			translate([78.25, 95.001, 0])(
				translate([8.5, 0, 0])(pocket(14)),
				translate([41, 0, 0])(pocket(6)),
			),
		);
	})();

	writeFiles({
		'codenames__base-keys': compile(baseKeyCardHolder),
		'codenames__duet-keys': compile(duetKeyCardHolder),
		'codenames__main': '$fn = 100;\n' + compile(mainCardHolder),
	});
}
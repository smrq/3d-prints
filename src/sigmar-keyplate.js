const { compile, globals } = require('@smrq/openscad-js');

const { skewb, hypotenuse, hypotenuseInv, writeFiles, zip, degToRad } = require('./shared');

with (globals(x => eval(x))) {
	const switchHoleSize = 14;
	const switchCapSize = 18;
	const keySpacing = 19.05;
	const flapWidth = 0.6;
	const flapHeight = 3.5;
	const gapBetweenFlaps = 5;

	const translateUV = ([x, y]) => (...children) => (
		translate([x * keySpacing, y * keySpacing, 0])(...children)
	);

	const keycapModel = ([u, v], c) => {
		const base1u = 18.415;
		const top1u = 12.7;
		const height = 7.3914;
		const radius = 59.81 * Math.max(u, v);

		const xBase = base1u + (u-1)*keySpacing;
		const yBase = base1u + (v-1)*keySpacing;
		const xTop = top1u + (u-1)*keySpacing;
		const yTop = top1u + (v-1)*keySpacing;

		return color(c)(
			difference()(
				skewb(xBase, yBase, xTop, yTop, height),
				translate([0, 0, height + hypotenuseInv(radius, hypotenuse(xTop, yTop)/2)])(
					sphere(radius, { $fn: 50 })
				)	
			)
		);
	};

	const keyswitchHole = (() => {
		const hole = square(switchHoleSize, { center: true });
		const flap = square([switchHoleSize + 2*flapWidth, flapHeight], { center: true });
		return union()(
			hole,
			translate([0, -(gapBetweenFlaps+flapHeight)/2, 0])(flap),
			translate([0,  (gapBetweenFlaps+flapHeight)/2, 0])(flap),
		);
	})();

	const keyArea = ([u, v]) => square([u*keySpacing, v*keySpacing], { center: true });

	const rgb = (r, g, b) => [r/255, g/255, b/255];
	const rcs = rgb(220, 162, 200);
	const rcj = rgb(166, 152, 197);
	const wan = rgb(232, 231, 227);

	const makeColumn = (uBase, vBase, keys) => {
		const result = [];

		let v = vBase;
		for (const [w, h, c = wan] of keys) {
			result.push({
				position: [uBase, v],
				size: [w, h],
				color: c
			});
			v += h;
		} 
		return result;
	};

	const translateArc = (angle, spacing, steps) => (...block) => {
		let r = spacing/2 / Math.tan(degToRad(angle)/2);
		r += (r > 0 ? 1 : -1) * spacing/2;
		return translate([0, -r])(
			rotate([0, 0, -angle*steps])(
				translate([0, r])(...block)
			)
		);
	}

	const placeKeyObjects = (fn) => {
		const orthoKeys = [
			...makeColumn(0, -0.3,  [[1,1,rcj], [1,1,rcj], [1,1,rcs]]),
			...makeColumn(1, -0.15, [[1,1], [1,1], [1,1]]),
			...makeColumn(2, 0.25,  [[1,1], [1,1], [1,1]]),
			...makeColumn(3, 0.5,   [[1,1], [1,1], [1,1]]),
			...makeColumn(4, 0.25,  [[1,1], [1,1], [1,1]]),
			...makeColumn(5, 0,     [[1,1], [1,1], [1,1]]),
		];

		return union()(
			...orthoKeys.map(({ position, size, color }) =>
				translateUV(position)(
					fn(size, color)
				)
			),
			translateUV([6, 0.75])(fn([1,2], rcj)),
			translateUV([0.5, -1.3])(fn([1,1], rcj)),
			translateUV([1.5, -1.15])(fn([1,1], rcj)),
			translateUV([2.5, -1])(fn([1,1], rcj)),
			translateUV([3.5, -1])(
				fn([1,1], rcj),
				translateArc(10, keySpacing, 1)(fn([1,1], rcj)),
				translateArc(10, keySpacing, 2)(fn([1,1], rcj)),
			),
		);
	}

	const keyplateBase = minkowski()(
		union()(
			placeKeyObjects(size => keyArea(size)),
			hull()(
				translateUV([6, 0.75])(keyArea([1,2])),
				translateUV([3.5, -1])(
					translateArc(10, keySpacing, 2)(keyArea([1,1], rcj))
				),
			)
		),
		circle(5)
	);

	const keyplateHoles = placeKeyObjects(() => keyswitchHole);

	const keyplate = difference()(keyplateBase, keyplateHoles);

	const keyplate3d = (() => {
		const plateThickness = 1.4; // should be 1.5
		const wallThickness = 3;
		const wallHeight = 10;

		const plateMain = linear_extrude({ height: plateThickness, center: false })(keyplate);
		const plateWalls = linear_extrude({ height: plateThickness + wallHeight, center: false })(
			difference()(
				keyplateBase,
				offset(-wallThickness)(keyplateBase)
			)
		);

		return union()(
			translate([0, 0, wallHeight])(plateMain),
			plateWalls
		);
	})();

	const preview = union()(
		translate([0, 0, 5])(
			placeKeyObjects((s, c) => keycapModel(s, c))
		),
		translate([0, 0, 2.5])(
			color(rgb(20, 20, 20))(
				placeKeyObjects(() => cube([switchHoleSize, switchHoleSize, 5], { center: true }))
			)
		),
		color(rgb(220, 220, 220))(keyplate),
	);

	writeFiles({
		'sigmar-keyplate__plate3d': compile(keyplate3d),
		'__sigmar-keyplate': compile(keyplate),
		'__sigmar-keyplate__test': compile(preview),
	});

}

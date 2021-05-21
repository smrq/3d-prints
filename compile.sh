#!/bin/bash

echo --- $1 ---

echo Building SCAD files...
yarn node src/$1.js

echo Building STL files...
for infile in scad/$1__*.scad; do
	outfile=$infile
	outfile=stl/${outfile#scad/}
	outfile=${outfile%.scad}.stl
	openscad -o $outfile $infile
done

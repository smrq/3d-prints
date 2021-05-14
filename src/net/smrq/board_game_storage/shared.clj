(ns net.smrq.board-game-storage.shared
  (:require [scad-clj.scad :as scad]
            [scad-clj.model :refer :all :exclude [import use]]))

(defn cube-z0 [x y z]
  (translate [0 0 (/ z 2)] (cube x y z :center true)))

(defn extrude-linear-y [keys block]
  (->>
   (extrude-linear keys block)
   (rotate [(/ Math/PI 2) 0 (/ Math/PI 2)])))

(defn write-scad-file [file model]
  (spit file (scad/write-scad model)))

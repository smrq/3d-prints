(ns net.smrq.board-game-storage.games.codenames
  (:require [net.smrq.board-game-storage.shared :refer :all]
            [scad-clj.model :refer :all :exclude [import use]]))

(def box-dimensions {:x 154 :y 222 :z 50})
(def rulebook-width 6)
(def box-height-full (- (get box-dimensions :z) rulebook-width))

(def base-key-card-holder
  (let [frame (cube-z0 100 73 box-height-full)
        hourglass-cutout (translate [0 0 10.5]
                                    (cube-z0 94 21 box-height-full)
                                    (rotate [0 (/ pi 2) 0] (cylinder 10.5 94)))
        card-cutout (cube-z0 68 68 box-height-full)
        grip-cutout (cube-z0 25 74 box-height-full)]
    (difference frame
                (translate [0 0 (- box-height-full 22)] hourglass-cutout)
                (translate [0 0 (- box-height-full (+ 22 13))] card-cutout)
                (translate [0 0 (- box-height-full (+ 22 13 3))] grip-cutout))))

(def duet-key-card-holder
  (let [frame (cube-z0 100 68 box-height-full)
        card-cutout (cube-z0 80 63 box-height-full)
        grip-cutout (cube-z0 25 69 box-height-full)]
    (difference frame
                (translate [0 0 (- box-height-full 35)] card-cutout)
                (translate [0 0 (- box-height-full (+ 35 3))] grip-cutout))))

(binding [*center* false *fn* 100]
  (def main-card-holder
    (let [width 122
          depth 154
          height box-height-full
          frame-thickness 2.5
          grip-radius 6
          grip-extra-depth 0.5
          pocket-width 23.5
          pocket-height 26
          height-offset 5
          angle (Math/atan2 14 height)
          frame (union (cube frame-thickness width height)
                       (->> (cube frame-thickness width height)
                            (translate [(- depth frame-thickness) 0 0]))
                       (->> (cube frame-thickness 49 height)
                            (translate [75.75 73 0]))
                       (->> (cube depth 10 height)
                            (translate [0 71 0]))
                       (->> (polygon [[0 0] [0 height] [1 height] [3 0]])
                            (extrude-linear-y {:height depth}))
                       (->> (polygon [[0 0] [14 0] [0 height]])
                            (extrude-linear-y {:height depth})
                            (translate [0 81 0]))
                       (->> (polygon [[0 0] [-3 0] [-1 height] [0 height]])
                            (extrude-linear-y {:height depth})
                            (translate [0 width 0])))
          pocket (fn [pocket-depth]
                   (let [grip-cylinder-depth (+ (- pocket-depth grip-radius) grip-extra-depth)]
                     (->> (union (->> (cube pocket-width pocket-depth pocket-height)
                                      (translate [0 (- pocket-depth) 0]))
                                 (->> (cube pocket-width grip-cylinder-depth (+ pocket-height grip-radius))
                                      (translate [0 (- grip-cylinder-depth) 0]))
                                 (->> (cylinder grip-radius pocket-width)
                                      (rotate [0 (/ pi 2) 0])
                                      (translate [0 (- grip-cylinder-depth) pocket-height])))
                          (translate [0 0 height-offset])
                          (rotate [angle 0 0]))))]
      (difference frame
                  (translate [78.25 95.001 0]
                             (translate [8.5 0 0] (pocket 14))
                             (translate [41 0 0] (pocket 6))))))

  (write-scad-file "scad/codenames__base-keys.scad" base-key-card-holder)
  (write-scad-file "scad/codenames__duet-keys.scad" duet-key-card-holder)
  (write-scad-file "scad/codenames__main.scad" main-card-holder))

; Day 9: All in a Single Night
; https://adventofcode.com/2015/day/9

(ns day09
  (:require [clojure.string :as str]))

(defn permutations [coll]
  (if (empty? coll)
    [[]]
    (for [x coll
          ps (permutations (disj (set coll) x))]
      (cons x ps))))

(defn calculate-distances [input]
  (let [lines (str/split input #"\r\n")
        distances (reduce (fn [acc line]
                          (let [[_ from to dist] (re-matches #"(\w+) to (\w+) = (\d+)" line)
                                distance (Integer/parseInt dist)]
                            (-> acc
                                (assoc-in [from to] distance)
                                (assoc-in [to from] distance))))
                        {}
                        lines)
        cities (-> distances keys set)
        routes (permutations cities)
        route-distances (map (fn [route]
                             (reduce + (map (fn [[city1 city2]]
                                            (get-in distances [city1 city2]))
                                          (partition 2 1 route))))
                           routes)]
    {:shortest-distance (apply min route-distances)
     :longest-distance (apply max route-distances)}))

(defn part1 [input]
  (:shortest-distance (calculate-distances input)))

(defn part2 [input]
  (:longest-distance (calculate-distances input)))

(def input (slurp "Day09.txt"))
(def input-test (slurp "Day09_test.txt"))

(println "Part 1:" (part1 input))
(println "Part 1:" (part1 input-test))
(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input-test))
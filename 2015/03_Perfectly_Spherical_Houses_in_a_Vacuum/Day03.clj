; Day 3: Perfectly Spherical Houses in a Vacuum
; https://adventofcode.com/2015/day/3

(defn read-input [name]
  (slurp (str name ".txt")))

(def directions
  {\^ [0 -1]
   \> [1 0]
   \v [0 1]
   \< [-1 0]})

(defn part1 [input]
  (let [visited (atom #{[0 0]})
        santa (atom [0 0])]
    (doseq [dir input]
      (let [[dx dy] (directions dir)
            [x y] @santa]
        (swap! santa (fn [[x y]] [(+ x dx) (+ y dy)]))
        (swap! visited conj @santa)))
    (count @visited)))

(defn part2 [input]
  (let [visited (atom #{[0 0]})
        santa (atom [0 0])
        robot-santa (atom [0 0])]
    (doseq [[i dir] (map-indexed vector input)]
      (let [[dx dy] (directions dir)]
        (if (even? i)
          (swap! santa (fn [[x y]] [(+ x dx) (+ y dy)]))
          (swap! robot-santa (fn [[x y]] [(+ x dx) (+ y dy)])))
        (swap! visited conj @santa @robot-santa)))
    (count @visited)))

(def day "Day03")
(def input-test (read-input (str day "_test")))

(def input1 ">")
(def input2 "^>v<")
(def input3 "^v^v^v^v^v")
(def input1v2 "^v")

(println "Part 1:" (part1 input1)) ; 2
(println "Part 1:" (part1 input2)) ; 4
(println "Part 1:" (part1 input3)) ; 2
(println "Part 1:" (part1 input-test)) ; 2572

(println "Part 2:" (part2 input1v2)) ; 3
(println "Part 2:" (part2 input2)) ; 3
(println "Part 2:" (part2 input3)) ; 11
(println "Part 2:" (part2 input-test)) ; 2631
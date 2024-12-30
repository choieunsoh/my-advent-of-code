; Day 1: Not Quite Lisp
; https://adventofcode.com/2015/day/1

(defn count-char [s ch]
  (count (filter #(= % ch) s)))

(defn part1 [input]
  (- (count-char input \() (count-char input \))))

(defn part2 [input]
  (loop [i 0
         floor 0]
    (if (= floor -1)
      i
      (recur (inc i) (+ floor (if (= (nth input i) \() 1 -1))))))

(defn read-input [name]
  (slurp (str name ".txt")))

(def input (read-input "Day01"))
(def input2 (read-input "Day01_2"))
(def input-test (read-input "Day01_test"))

(println (part1 input))
(println (part1 input-test))

(println (part2 input2))
(println (part2 input-test))
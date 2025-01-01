; Day 10: Elves Look, Elves Say
; https://adventofcode.com/2015/day/10

(ns day10
  (:require [clojure.string :as str]))

(defn look-and-say
  "Generate look-and-say sequence for given input"
  [sequence]
  (loop [result (StringBuilder.)
         remaining (seq sequence)
         current (first remaining)
         count 1]
    (if-let [next (first (rest remaining))]
      (if (= next current)
        (recur result (rest remaining) current (inc count))
        (recur (.append (.append result count) current) 
               (rest remaining) 
               next 
               1))
      (str (.append (.append result count) current)))))

(defn generate-look-and-say-sequence [input iterations]
  {:pre [(re-matches #"^\d+$" input)]}
  (loop [sequence input
         i 0]
    (if (= i iterations)
      (count sequence)
      (recur (look-and-say sequence) (inc i)))))

(defn part1 [input]
  (generate-look-and-say-sequence input 40))

(defn part2 [input]
  (generate-look-and-say-sequence input 50))

(def input "1")
(def input-test "1113222113")

(println "Part 1:" (part1 input))
(println "Part 1:" (part1 input-test))
(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input-test))
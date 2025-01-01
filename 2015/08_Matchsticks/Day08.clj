; Day 8: Matchsticks
; https://adventofcode.com/2015/day/8

(ns day08
  (:require [clojure.string :as str]))

(def escape-sequences
  {:slash #"\\{2}"
   :quote #"\\\""
   :ascii #"\\x[0-9a-f]{2}"})

(defn count-escape-sequences [line]
  (let [trimmed-line (subs line 1 (dec (count line)))]
    {:slash-count (count (re-seq (:slash escape-sequences) trimmed-line))
     :quote-count (count (re-seq (:quote escape-sequences) trimmed-line))
     :ascii-count (count (re-seq (:ascii escape-sequences) trimmed-line))}))

(defn calculate-added-length [line initial-length adjustments]
  (let [{:keys [slash-count quote-count ascii-count]} (count-escape-sequences line)]
    (+ initial-length
       (* (:slash adjustments) slash-count)
       (* (:quote adjustments) quote-count)
       (* (:ascii adjustments) ascii-count))))

(defn part1 [input]
  (let [lines (str/split input #"\r\n")
        adjustments {:slash 1 :quote 1 :ascii 3}]
    (reduce + (map #(calculate-added-length % 2 adjustments) lines))))

(defn part2 [input]
  (let [lines (str/split input #"\r\n")
        adjustments {:slash 2 :quote 2 :ascii 1}]
    (reduce + (map #(calculate-added-length % 4 adjustments) lines))))

(def input (slurp "Day08.txt"))
(def input-test (slurp "Day08_test.txt"))

(println "Part 1:" (part1 input))
(println "Part 1:" (part1 input-test))
(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input-test))
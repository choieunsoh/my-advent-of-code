; Day 5: Doesn't He Have Intern-Elves For This?
; https://adventofcode.com/2015/day/5

(ns day05
  (:require [clojure.string :as str]))

(defn read-input [name]
  (slurp (str name ".txt")))

(defn has-triple-vowels [s]
  (>= (count (re-seq #"[aeiou]" s)) 3))

(defn has-double-letters [s]
  (boolean (re-find #"([a-z])\1" s)))

(defn has-no-forbidden-pairs [s]
  (not (re-find #"ab|cd|pq|xy" s)))

(defn has-twice-letter-pair [s]
  (boolean (re-find #"([a-z]{2})[a-z]*\1" s)))

(defn has-single-letter-between-them [s]
  (boolean (re-find #"([a-z])[a-z]\1" s)))

(defn is-nice-string-part1 [s]
  (and (has-triple-vowels s)
       (has-double-letters s)
       (has-no-forbidden-pairs s)))

(defn is-nice-string-part2 [s]
  (and (has-twice-letter-pair s)
       (has-single-letter-between-them s)))

(defn part1 [input]
  (count (filter is-nice-string-part1 (str/split input #"\r\n"))))

(defn part2 [input]
  (count (filter is-nice-string-part2 (str/split input #"\r\n"))))

(def day "Day05")
(def input (read-input day))
(def input-test (read-input (str day "_test")))

(println "Part 1:" (part1 input))
(println "Part 1:" (part1 input-test))

(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input-test))
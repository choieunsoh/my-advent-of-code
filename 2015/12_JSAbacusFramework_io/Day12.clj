; Day 12: JSAbacusFramework.io
; https://adventofcode.com/2015/day/12

(ns day12
  (:require [clojure.data.json :as json]
            [clojure.string :as str]))

(defn sum-numbers [input]
  (->> (re-seq #"-?\d+" input)
       (map #(Integer/parseInt %))
       (reduce +)))

(defn sum-json-numbers
  ([data] (sum-json-numbers data false))
  ([data skip-red]
   (cond
     (number? data) data
     (vector? data) (reduce + (map #(sum-json-numbers % skip-red) data))
     (map? data) (if (and skip-red (some #(= % "red") (vals data)))
                   0
                   (reduce + (map #(sum-json-numbers % skip-red) (vals data))))
     :else 0)))

(defn part1 [input]
  (sum-numbers input))

(defn part2 [input]
  (sum-json-numbers (json/read-str input) true))

(let [input (slurp "Day12.txt")
      input-test (slurp "Day12_test.txt")]
  (println "Part 1:" (part1 input))
  (println "Part 1:" (part1 input-test))

  (println "Part 2:" (part1 input))
  (println "Part 2:" (part2 input-test)))
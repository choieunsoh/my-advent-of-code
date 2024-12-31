; Day 7: Some Assembly Required
; https://adventofcode.com/2015/day/7

(ns day07
  (:require [clojure.string :as str]))

(def mask 0xFFFF)

(def operations
  {"ASSIGN" (fn [a _] (bit-and a mask))
   "NOT" (fn [a _] (bit-and (bit-not a) mask))
   "AND" (fn [a b] (bit-and (bit-and a b) mask))
   "OR" (fn [a b] (bit-and (bit-or a b) mask))
   "LSHIFT" (fn [a b] (bit-and (bit-shift-left a b) mask))
   "RSHIFT" (fn [a b] (bit-and (bit-shift-right a b) mask))})

(defn parse-instruction [line]
  (let [parts (str/split line #"\s+")]
    (case (count parts)
      3 {:operation "ASSIGN" :input1 (first parts) :output (last parts)}
      4 {:operation "NOT" :input1 (second parts) :output (last parts)}
      {:operation (second parts)
       :input1 (first parts)
       :input2 (nth parts 2)
       :output (last parts)})))

(defn prepare-data [input]
  (map parse-instruction (str/split input #"\r\n")))

(defn execute-circuit [instructions target initial-values]
  (let [wires (atom initial-values)
        executed (atom (set (keys initial-values)))
        is-valid? (fn [input]
                   (or (re-matches #"\d+" input)
                       (contains? @wires input)))
        get-value (fn [input]
                   (if (re-matches #"\d+" input)
                     (Integer/parseInt input)
                     (@wires input)))]
    (while (< (count @executed) (count instructions))
      (doseq [{:keys [operation input1 input2 output]} instructions]
        (when (and (not (contains? @executed output))
                  (is-valid? input1)
                  (or (nil? input2) (is-valid? input2)))
          (let [v1 (get-value input1)
                v2 (when input2 (get-value input2))]
            (swap! wires assoc output ((operations operation) v1 v2))
            (swap! executed conj output)))))
    (@wires target)))

(defn part1 [input]
  (execute-circuit (prepare-data input) "a" {}))

(defn part2 [input]
  (let [instructions (prepare-data input)
        a-value (execute-circuit instructions "a" {})]
    (execute-circuit instructions "a" {"b" a-value})))

(def input (slurp "Day07.txt"))
(def input-test (slurp "Day07_test.txt"))

(println "Part 1:" (part1 input))
(println "Part 1:" (part1 input-test))
(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input-test))
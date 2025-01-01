; Day 11: Corporate Policy
; https://adventofcode.com/2015/day/11

(ns day11
  (:require [clojure.string :as str]))

(defn increment-password [s]
  (let [chars (StringBuilder. s)]
    (loop [i (dec (.length chars))]
      (if (>= i 0)
        (if (= (.charAt chars i) \z)
          (do
            (.setCharAt chars i \a)
            (recur (dec i)))
          (.setCharAt chars i (char (inc (int (.charAt chars i))))))
        nil))
    (.toString chars)))

(defn valid-password? [password]
  (and
    (not (re-find #"[iol]" password))
    (re-find #"([a-z])\1.*([a-z])\2" password)
    (re-find #"abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz" password)))

(defn part1 [input]
  (loop [password input]
    (if (valid-password? password)
      password
      (recur (increment-password password)))))

(defn part2 [input]
  (part1 (increment-password (part1 input))))

(def input (part1 "abcdefgh"))
(def input2 (part1 "ghijklmn"))
(def input-test (part1 "hepxcrrq"))

(println "Part 1:" input)
(println "Part 1:" input2)
(println "Part 1:" input-test)

(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input2))
(println "Part 2:" (part2 input-test))
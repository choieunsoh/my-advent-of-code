; Day 4: The Ideal Stocking Stuffer
; https://adventofcode.com/2015/day/4

(ns day04
  (:require [clojure.string :as str])
  (:import [java.security MessageDigest]))

(defn md5 [input]
  (let [md (MessageDigest/getInstance "MD5")
        bytes (.digest md (.getBytes input))]
    (apply str (map #(format "%02x" %) bytes))))

(defn part1 [input]
  (loop [running-number 0]
    (if (.startsWith (md5 (str input running-number)) "00000")
      running-number
      (recur (inc running-number)))))

(defn part2 [input]
  (loop [running-number 0]
    (if (.startsWith (md5 (str input running-number)) "000000")
      running-number
      (recur (inc running-number)))))

(def input1 "abcdef")
(def input2 "pqrstuv")
(def input-test "bgvyzdsv")

(println "Part 1:" (part1 input1)) ; 609043
(println "Part 1:" (part1 input2)) ; 1048970
(println "Part 1:" (part1 input-test)) ; 254575

(println "Part 2:" (part2 input1)) ; 6742839
(println "Part 2:" (part2 input2)) ; 5714438
(println "Part 2:" (part2 input-test)) ; 1038736
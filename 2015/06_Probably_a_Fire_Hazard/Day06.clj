; Day 6: Probably a Fire Hazard
; https://adventofcode.com/2015/day/6

(ns day06
  (:require [clojure.string :as str]))

(defn read-input [name]
  (slurp (str name ".txt")))

(defn prepare-data [input]
  (->> (str/split input #"\r\n")
       (map #(re-matches #"(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)" %))
       (map (fn [[_ action x1 y1 x2 y2]]
             {:action action
              :x1 (Integer/parseInt x1)
              :y1 (Integer/parseInt y1)
              :x2 (Integer/parseInt x2)
              :y2 (Integer/parseInt y2)}))))

(defn create-grid []
  (vec (repeat 1000 (vec (repeat 1000 0)))))

(defn update-cell-part1 [grid x y action]
  (assoc-in grid [x y]
    (case action
      "turn on" 1
      "turn off" 0
      "toggle" (if (= (get-in grid [x y]) 1) 0 1))))

(defn update-cell-part2 [grid x y action]
  (assoc-in grid [x y]
    (case action
      "turn on" (inc (get-in grid [x y]))
      "turn off" (max 0 (dec (get-in grid [x y])))
      "toggle" (+ 2 (get-in grid [x y])))))

(defn part1 [input]
  (let [instructions (prepare-data input)
        grid (create-grid)]
    (->> instructions
         (reduce 
           (fn [grid {:keys [action x1 y1 x2 y2]}]
             (reduce 
               (fn [g x]
                 (reduce 
                   (fn [g y] (update-cell-part1 g x y action))
                   g 
                   (range y1 (inc y2))))
               grid 
               (range x1 (inc x2))))
           grid)
         flatten
         (reduce +))))

(defn part2 [input]
  (let [instructions (prepare-data input)
        grid (create-grid)]
    (->> instructions
         (reduce 
           (fn [grid {:keys [action x1 y1 x2 y2]}]
             (reduce 
               (fn [g x]
                 (reduce 
                   (fn [g y] (update-cell-part2 g x y action))
                   g 
                   (range y1 (inc y2))))
               grid 
               (range x1 (inc x2))))
           grid)
         flatten
         (reduce +))))

(def day "Day06")
(def input (read-input day))
(def input-test (read-input (str day "_test")))

(println "Part 1:" (part1 input))
(println "Part 1:" (part1 input-test))
(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input-test))

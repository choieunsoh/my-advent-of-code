; Day 13: Knights of the Dinner Table
; https://adventofcode.com/2015/day/13

(ns day13
  (:require [clojure.string :as str]))

(defn permutations [coll]
  (if (empty? coll)
    '(())
    (for [x coll
          ps (permutations (disj (set coll) x))]
      (cons x ps))))

(defn parse-line [line]
  (let [[_ name gain-lose value next] 
        (re-matches #"(\w+) would (lose|gain) (\d+) happiness units by sitting next to (\w+)\." line)]
    {:name name
     :next next
     :happiness (* (Integer/parseInt value)
                  (if (= gain-lose "gain") 1 -1))}))

(defn build-happiness-map [input]
  (let [entries (map parse-line (str/split-lines input))]
    (reduce (fn [m {:keys [name next happiness]}]
             (assoc-in m [name next] happiness))
           {}
           entries)))

(defn calculate-happiness [input include-me?]
  (let [happiness-map (build-happiness-map input)
        names (set (keys happiness-map))
        n (count names)
        pairs (if include-me? (dec n) n)]
    (->> (permutations names)
         (map (fn [arrangement]
                (reduce + 
                  (for [i (range pairs)]
                    (let [current (nth arrangement i)
                          next (nth arrangement (mod (inc i) n))]
                      (+ (get-in happiness-map [current next] 0)
                         (get-in happiness-map [next current] 0)))))))
         (apply max))))

(defn part1 [input]
  (calculate-happiness input false))

(defn part2 [input]
  (calculate-happiness input true))

(let [input (slurp "Day13.txt")
      input-test (slurp "Day13_test.txt")]
  (println "Part 1:" (part1 input))
  (println "Part 1:" (part1 input-test))
  (println "Part 2:" (part2 input))
  (println "Part 2:" (part2 input-test)))
; Day 2: I Was Told There Would Be No Math
; https://adventofcode.com/2015/day/2

(defn read-input [name]
  (slurp (str name ".txt")))

(defn parse-box [box-str]
  (let [[l w h] (map #(Integer/parseInt %) (clojure.string/split box-str #"x"))]
    {:l l :w w :h h}))

(defn prepare-data [input]
  (map parse-box (clojure.string/split input #"\r\n")))

(defn calculate-wrapping-paper [{:keys [l w h]}]
  (let [sides [(* l w) (* w h) (* h l)]
        smallest-side (apply min sides)]
    (+ (* 2 (apply + sides)) smallest-side)))

(defn calculate-wrapping-ribbon [{:keys [l w h]}]
  (let [max-side (apply max [l w h])
        other-sides (- (+ l w h) max-side)
        perimeter (* 2 other-sides)
        volume (* l w h)]
    (+ perimeter volume)))

(defn part1 [input]
  (let [boxes (prepare-data input)]
    (reduce + (map calculate-wrapping-paper boxes))))

(defn part2 [input]
  (let [boxes (prepare-data input)]
    (reduce + (map calculate-wrapping-ribbon boxes))))

(def day "Day02")
(def input (read-input day))
(def input-test (read-input (str day "_test")))

(println "Part 1:" (part1 input))
(println "Part 1:" (part1 input-test))

(println "Part 2:" (part2 input))
(println "Part 2:" (part2 input-test))
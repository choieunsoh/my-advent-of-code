// Day 1: Historian Hysteria
// https://adventofcode.com/2024/day/1

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().trim().lines()

fun main() {
    fun prepareInput(input: List<String>) {
        return input
            .map { 
                val parts = it.split("\\s+".toRegex())
                parts[0].toInt() to parts[1].toInt() 
            }
            .unzip()
    }
    
    fun part1(input: List<String>): Int {
        val (leftNumbers, rightNumbers) = prepareInput(input)

        val sortedLeftNumbers = leftNumbers.sorted()
        val sortedRightNumbers = rightNumbers.sorted()

        val sumOfAbsDiff = sortedLeftNumbers.zip(sortedRightNumbers)
            .map { kotlin.math.abs(it.first - it.second) }
            .sum()

        return sumOfAbsDiff
    }

    fun part2(input: List<String>): Int {
        val (leftNumbers, rightNumbers) = prepareInput(input)
        
        val frequencyMap = rightNumbers.groupingBy { it }.eachCount()
        val similarityScore = leftNumbers
            .map { it * frequencyMap.getOrDefault(it, 0) }
            .sum()
        return similarityScore
    }

    // Test if implementation meets criteria from the description, like:
    var testInput = readInput("Day01")
    check(part1(testInput) == 11)
    check(part2(testInput) == 31)

    // Or read a large test input from the `src/Day01_test.txt` file:
    testInput = readInput("Day01_test")
    check(part1(testInput) == 1941353)

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("Day01_test")
    println(part1(input))
    println(part2(input))
}
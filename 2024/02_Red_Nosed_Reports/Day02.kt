// Day 2: Red-Nosed Reports
// https://adventofcode.com/2024/day/2

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().trim().lines()

fun main() {
    fun prepareInput(input: List<String>): List<List<Int>> {
        return input.map { it.split(' ').map { it.toInt() } }
    }

    fun isSafeReport(report: List<Int>, allowOneRemoval: Boolean): Boolean {
        if (report.size == 0) return false
        
        val MIN_DIFF = 1
        val MAX_DIFF = 3
        val direction = if (report[1] - report[0] > 0) 1 else -1

        for (i in 1 until report.size) {
            val diff = (report[i] - report[i - 1]) * direction
            if (diff >= MIN_DIFF && diff <= MAX_DIFF) continue

            if (!allowOneRemoval) return false

            // case i-0: 26, 24, 22, x[18], 20
            // case i-1: 24, x27, [22], 21, 19, 17, 15, 14
            // case i-2: x20, 17, [18], 21, 23, 25
            for (removedIndex in i downTo maxOf(0, i - 2)) {
                val newReport = report.toMutableList()
                newReport.removeAt(removedIndex)
                if (isSafeReport(newReport, false)) return true
            }
            return false            
        }
        return true
    }

    fun run(input: List<String>, allowOneRemoval: Boolean): Int {
        val data = prepareInput(input)
        return data.map { isSafeReport(it, allowOneRemoval) }.count { it }
    }
    
    fun part1(input: List<String>): Int {
        return run(input, false)
    }

    fun part2(input: List<String>): Int {
        return run(input, true)
    }

    // Test if implementation meets criteria from the description, like:
    var testInput = readInput("Day02")
    check(part1(testInput) == 2)
    check(part2(testInput) == 4)

    testInput = readInput("Day02_test")
    check(part1(testInput) == 686)

    val input = readInput("Day02_test")
    println(part1(input))
    println(part2(input))
}

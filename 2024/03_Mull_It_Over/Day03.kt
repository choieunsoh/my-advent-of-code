// Day 3: Mull It Over
// https://adventofcode.com/2024/day/3

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().trim().lines()

fun main() {
    fun prepareInput(input: List<String>): String {
        return input.joinToString("")
    }
    
    fun part1(input: List<String>): Int {
        val data = prepareInput(input)
        val regex = Regex("mul\\((\\d+),(\\d+)\\)")
        var totalSum = 0
        regex.findAll(data).forEach { matchResult ->
            val num1 = matchResult.groupValues[1].toInt()
            val num2 = matchResult.groupValues[2].toInt()
            val product = num1 * num2
            totalSum += product
        }
        return totalSum
    }

    fun part2(input: List<String>): Int {
        val data = prepareInput(input)
        val regex = Regex("(do\\(\\)|don't\\(\\)|mul\\((\\d+),(\\d+)\\))")
        var totalSum = 0
        var multiplyFactor = 1
        regex.findAll(data).forEach { matchResult ->
            val match = matchResult.groupValues[0]
            if (match.startsWith("do")) {
                multiplyFactor = if (match == "don't()") 0 else 1
                return@forEach
            }
            val num1 = matchResult.groupValues[2].toInt()
            val num2 = matchResult.groupValues[3].toInt()
            val product = multiplyFactor * num1 * num2
            totalSum += product
        }
        return totalSum
    }

    check(part1(readInput("Day03")) == 161)
    check(part2(readInput("Day03_part2")) == 48)

    val input = readInput("Day03_test")
    println(part1(input)) // 155955228
    println(part2(input)) // 100189366
}

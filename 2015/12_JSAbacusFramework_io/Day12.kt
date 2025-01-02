// Day 12: JSAbacusFramework.io
// https://adventofcode.com/2015/day/12

import kotlinx.serialization.json.*

fun sumNumbers(input: String): Int =
    "-?\\d+".toRegex().findAll(input)
        .sumOf { it.value.toInt() }

fun sumJsonNumbers(element: JsonElement, skipRed: Boolean = false): Int =
    when (element) {
        is JsonPrimitive -> element.intOrNull ?: 0
        is JsonArray -> element.sumOf { sumJsonNumbers(it, skipRed) }
        is JsonObject -> when {
            skipRed && element.values.any { it.jsonPrimitive.contentOrNull == "red" } -> 0
            else -> element.values.sumOf { sumJsonNumbers(it, skipRed) }
        }
    }

fun part1(input: String): Int = sumNumbers(input)

fun part2(input: String): Int =
    sumJsonNumbers(Json.parseToJsonElement(input), true)

fun main() {
    val input = java.io.File("Day12.txt").readText()
    val inputTest = java.io.File("Day12_test.txt").readText()
    
    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")

    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
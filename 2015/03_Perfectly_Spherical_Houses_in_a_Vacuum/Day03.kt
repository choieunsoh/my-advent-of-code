// Day 3: Perfectly Spherical Houses in a Vacuum
// https://adventofcode.com/2015/day/3

import java.nio.file.Files
import java.nio.file.Paths

fun readInput(name: String): String {
    return Files.readString(Paths.get("$name.txt")).trim()
}

val DIRECTIONS = mapOf(
    '^' to Pair(0, -1),
    '>' to Pair(1, 0),
    'v' to Pair(0, 1),
    '<' to Pair(-1, 0)
)

fun part1(input: String): Int {
    var santa = Pair(0, 0)
    val visited = mutableSetOf(santa)
    for (dir in input) {
        val (dx, dy) = DIRECTIONS[dir] ?: Pair(0, 0)
        santa = Pair(santa.first + dx, santa.second + dy)
        visited.add(santa)
    }
    return visited.size
}

fun part2(input: String): Int {
    var santa = Pair(0, 0)
    var robotSanta = Pair(0, 0)
    val visited = mutableSetOf(santa, robotSanta)
    for (i in input.indices step 2) {
        val (dx1, dy1) = DIRECTIONS[input[i]] ?: Pair(0, 0)
        santa = Pair(santa.first + dx1, santa.second + dy1)
        visited.add(santa)
        if (i + 1 < input.length) {
            val (dx2, dy2) = DIRECTIONS[input[i + 1]] ?: Pair(0, 0)
            robotSanta = Pair(robotSanta.first + dx2, robotSanta.second + dy2)
            visited.add(robotSanta)
        }
    }
    return visited.size
}

fun main() {
    val day = "Day03"
    val inputTest = readInput("${day}_test")

    val input1 = ">"
    val input2 = "^>v<"
    val input3 = "^v^v^v^v^v"
    val input1v2 = "^v"

    println("Part 1: ${part1(input1)}") // 2
    println("Part 1: ${part1(input2)}") // 4
    println("Part 1: ${part1(input3)}") // 2
    println("Part 1: ${part1(inputTest)}") // 2572

    println("Part 2: ${part2(input1v2)}") // 3
    println("Part 2: ${part2(input2)}") // 3
    println("Part 2: ${part2(input3)}") // 11
    println("Part 2: ${part2(inputTest)}") // 2631
}
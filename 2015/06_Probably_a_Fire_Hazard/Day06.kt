// Day 6: Probably a Fire Hazard
// https://adventofcode.com/2015/day/6

import java.nio.file.Files
import java.nio.file.Paths

fun readInput(name: String): String {
    return Files.readString(Paths.get("$name.txt")).trim()
}

data class Instruction(val action: String, val x1: Int, val y1: Int, val x2: Int, val y2: Int)

fun prepareData(input: String): List<Instruction> {
    val pattern = Regex("(turn on|turn off|toggle) (\\d+),(\\d+) through (\\d+),(\\d+)")
    return input.split("\r\n").map { line ->
        val matchResult = pattern.find(line)!!
        val (action, x1, y1, x2, y2) = matchResult.destructured
        Instruction(action, x1.toInt(), y1.toInt(), x2.toInt(), y2.toInt())
    }
}

fun part1(input: String): Int {
    val instructions = prepareData(input)
    val grid = Array(1000) { IntArray(1000) }

    for ((action, x1, y1, x2, y2) in instructions) {
        for (x in x1..x2) {
            for (y in y1..y2) {
                when (action) {
                    "turn on" -> grid[x][y] = 1
                    "turn off" -> grid[x][y] = 0
                    "toggle" -> grid[x][y] = if (grid[x][y] == 1) 0 else 1
                }
            }
        }
    }

    return grid.sumOf { row -> row.sum() }
}

fun part2(input: String): Int {
    val instructions = prepareData(input)
    val grid = Array(1000) { IntArray(1000) }

    for ((action, x1, y1, x2, y2) in instructions) {
        for (x in x1..x2) {
            for (y in y1..y2) {
                when (action) {
                    "turn on" -> grid[x][y]++
                    "turn off" -> if (grid[x][y] > 0) grid[x][y]--
                    "toggle" -> grid[x][y] += 2
                }
            }
        }
    }

    return grid.sumOf { row -> row.sum() }
}

fun main() {
    val day = "Day06"
    val input = readInput(day)
    val inputTest = readInput("${day}_test")

    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")

    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
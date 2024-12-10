// Day 10: Hoof It
// https://adventofcode.com/2024/day/10

import java.io.File

fun readInput(filename: String) = File("$filename.txt").readText().trim()

fun buildGrid(input: String) = input.lines().map { it.trim().map { it.digitToInt() } }

fun getNinthPointsFromZeroPoints(grid: List<List<Int>>) = grid.flatMapIndexed { row, line ->
    line.mapIndexedNotNull { col, value ->
        if (value == 0) getNinthPoints(row, col, grid) else null
    }
}

fun getNinthPoints(startRow: Int, startCol: Int, grid: List<List<Int>>): List<Int> {
    val rows = grid.size
    val cols = grid[0].size
    val directions = listOf(0, 1, 0, -1, 0)
    val ninthPoints = mutableListOf<Int>()
    val queue = ArrayDeque<Triple<Int, Int, Int>>()
    queue.add(Triple(startRow, startCol, 0))

    fun isInBounds(row: Int, col: Int) = row in 0 until rows && col in 0 until cols

    while (queue.isNotEmpty()) {
        val (row, col, currentNumber) = queue.removeFirst()

        if (currentNumber == 9) {
            val key = row * cols + col
            ninthPoints.add(key)
            continue
        }

        for (d in 0 until 4) {
            val newRow = row + directions[d]
            val newCol = col + directions[d + 1]
            val nextNumber = currentNumber + 1

            if (isInBounds(newRow, newCol) && grid[newRow][newCol] == nextNumber) {
                queue.add(Triple(newRow, newCol, nextNumber))
            }
        }
    }
    return ninthPoints
}

fun part1(input: String): Int {    
    val grid = buildGrid(input)
    val ninthPoints = getNinthPointsFromZeroPoints(grid)
    return ninthPoints.map { it.toSet().size }.sum()
}

fun part2(input: String): Int {
    val grid = buildGrid(input)
    val ninthPoints = getNinthPointsFromZeroPoints(grid)
    return ninthPoints.flatten().size
}

fun main() {
    val input = readInput("Day10")
    val inputTest = readInput("Day10_test")

    println("Part 1: ${part1(input)}") // 36
    println("Part 1 Test: ${part1(inputTest)}") // 825

    println("Part 2: ${part2(input)}") // 81
    println("Part 2 Test: ${part2(inputTest)}") // 1805
}

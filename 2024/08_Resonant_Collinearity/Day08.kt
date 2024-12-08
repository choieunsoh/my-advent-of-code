// Day 8: Resonant Collinearity
// https://adventofcode.com/2024/day/8

import java.io.File

fun readInput(filename: String): String {
    return File("$filename.txt").readText()
}

fun parsedGrid(input: String): List<MutableList<Char>> =
    input.lines()
        .filter { it.isNotBlank() }
        .map { it.toMutableList() }

fun isInBounds(grid: List<List<Char>>, row: Int, col: Int): Boolean =
    row in grid.indices && col in grid[0].indices

fun computeAntennaNodes(grid: List<List<Char>>): Map<Char, List<Pair<Int, Int>>> =
    grid.flatMapIndexed { row, line ->
        line.mapIndexedNotNull { col, cell ->
            if (cell != '.') cell to Pair(row, col) else null
        }
    }.groupBy({ it.first }, { it.second })

fun computeAntiNodes(
    grid: List<MutableList<Char>>,
    includeSelfNode: Boolean = false,
    infiniteFrequency: Boolean = false
): Set<Pair<Int, Int>> {
    val antennaMap = computeAntennaNodes(grid)
    val antiNodeSet = mutableSetOf<Pair<Int, Int>>()

    antennaMap.values.forEach { nodes ->
        nodes.forEachIndexed { i, (row1, col1) ->
            for (j in i + 1 until nodes.size) {
                val (row2, col2) = nodes[j]

                if (includeSelfNode) {
                    antiNodeSet += Pair(row1, col1)
                    antiNodeSet += Pair(row2, col2)
                }

                val diffRow = row1 - row2
                val diffCol = col1 - col2

                generateAntiNodes(grid, row2, col2, diffRow, diffCol, infiniteFrequency, antiNodeSet)
                generateAntiNodes(grid, row1, col1, -diffRow, -diffCol, infiniteFrequency, antiNodeSet)
            }
        }
    }
    return antiNodeSet
}

fun generateAntiNodes(
    grid: List<MutableList<Char>>,
    startRow: Int,
    startCol: Int,
    diffRow: Int,
    diffCol: Int,
    infiniteFrequency: Boolean,
    antiNodeSet: MutableSet<Pair<Int, Int>>
) {
    var distanceFactor = 2
    while (true) {
        val newRow = startRow + diffRow * distanceFactor
        val newCol = startCol + diffCol * distanceFactor

        if (!isInBounds(grid, newRow, newCol)) break

        grid[newRow][newCol] = '#'
        antiNodeSet += Pair(newRow, newCol)

        if (!infiniteFrequency) break
        distanceFactor++
    }
}

fun part1(input: String): Int {
    val grid = parsedGrid(input).map { it.toMutableList() }
    val antiNodes = computeAntiNodes(grid, includeSelfNode = false, infiniteFrequency = false)
    grid.forEach { row -> println(row.joinToString("")) }
    return antiNodes.size
}

fun part2(input: String): Int {
    val grid = parsedGrid(input).map { it.toMutableList() }
    val antiNodes = computeAntiNodes(grid, includeSelfNode = true, infiniteFrequency = true)
    grid.forEach { row -> println(row.joinToString("")) }
    return antiNodes.size
}

fun main() {
    val input = readInput("Day08")
    val inputTest = readInput("Day08_test")

    println("Part 1: ${part1(input)}")
    println("Part 1 Test: ${part1(inputTest)}")

    println("Part 2: ${part2(input)}")
    println("Part 2 Test: ${part2(inputTest)}")
}

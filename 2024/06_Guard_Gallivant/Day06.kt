// Day 6: Guard Gallivant
// https://adventofcode.com/2024/day/6

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().split("\n").map { it.toCharArray() }.toTypedArray()

fun main() {
    val EMPTY = '.'
    val STARTING_POINT = '^'
    val OBSTACLE = '#'
    val VISITED = 'x'

    fun isInBounds(grid: Array<CharArray>, row: Int, col: Int): Boolean {
        return row in grid.indices && col in grid[0].indices
    }

    fun findStartingPosition(grid: Array<CharArray>): Pair<Int, Int>? {
        for (row in grid.indices) {
            for (col in grid[row].indices) {
                if (grid[row][col] == STARTING_POINT) {
                    return row to col
                }
            }
        }
        return null
    }

    fun markAsVisited(grid: Array<CharArray>): List<Pair<Int, Int>> {
        val visitedList = mutableListOf<Pair<Int, Int>>()
        var (row, col) = findStartingPosition(grid) ?: (0 to 0)

        var rowDirection = -1
        var colDirection = 0

        while (true) {
            val nextRow = row + rowDirection
            val nextCol = col + colDirection

            if (!isInBounds(grid, nextRow, nextCol)) break

            if (grid[nextRow][nextCol] == OBSTACLE) {
                // Turn RIGHT
                val temp = rowDirection
                rowDirection = colDirection
                colDirection = -temp
            } else {
                row = nextRow
                col = nextCol

                if (grid[row][col] == EMPTY) {
                    grid[row][col] = VISITED
                    visitedList.add(row to col)
                }
            }
        }
        return visitedList
    }

    fun toDir(rowDirection: Int, colDirection: Int): String {
        return when {
            rowDirection == -1 && colDirection == 0 -> "U"
            rowDirection == 1 && colDirection == 0 -> "D"
            rowDirection == 0 && colDirection == -1 -> "L"
            rowDirection == 0 && colDirection == 1 -> "R"
            else -> throw IllegalArgumentException("Invalid direction")
        }
    }

    fun isCycle(
        grid: Array<CharArray>,
        startRow: Int,
        startCol: Int,
        rowObstacle: Int,
        colObstacle: Int
    ): Boolean {
        grid[rowObstacle][colObstacle] = OBSTACLE

        var dir = "U"
        var rowDirection = -1
        var colDirection = 0

        val visited = mutableSetOf<Triple<Int, Int, String>>()
        visited.add(Triple(startRow, startCol, dir))

        var row = startRow
        var col = startCol

        while (true) {
            val nextRow = row + rowDirection
            val nextCol = col + colDirection

            if (!isInBounds(grid, nextRow, nextCol)) {
                grid[rowObstacle][colObstacle] = EMPTY
                return false
            }

            if (grid[nextRow][nextCol] == OBSTACLE) {
                // Turn RIGHT
                val temp = rowDirection
                rowDirection = colDirection
                colDirection = -temp
                dir = toDir(rowDirection, colDirection)
            } else {
                row = nextRow
                col = nextCol
            }

            val currentState = Triple(row, col, dir)
            if (visited.contains(currentState)) {
                grid[rowObstacle][colObstacle] = EMPTY
                return true
            }

            visited.add(currentState)
        }
    }

    fun part1(grid: Array<CharArray>): Int {
        val visitedList = markAsVisited(grid)
        return visitedList.size + 1 // Include the starting position
    }

    fun part2(grid: Array<CharArray>): Int {
        val visitedList = markAsVisited(grid)
        val (startRow, startCol) = findStartingPosition(grid) ?: (0 to 0)
        var countCycle = 0
        for ((row, col) in visitedList) {
            if (isCycle(grid, startRow, startCol, row, col)) {
                countCycle++
            }
        }
        return countCycle
    }

    println(part1(readInput("Day06"))) // 41
    println(part2(readInput("Day06"))) // 6

    println(part1(readInput("Day06_test"))) // 4826
    println(part2(readInput("Day06_test"))) // 1721
    
}

// Day 4: Ceres Search
// https://adventofcode.com/2024/day/4

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().trim().lines()

fun main() {
    fun prepareInput(input: List<String>): Array<CharArray> {
        return input.map { it.toCharArray() }.toTypedArray()
    }

    fun countWordInGrid(grid: Array<CharArray>): Int {
        val word = "XMAS"
        val rows = grid.size
        val cols = grid[0].size

        fun search(row: Int, col: Int, wordIndex: Int, dRow: Int, dCol: Int): Boolean {
            if (wordIndex == word.length) return true
            if (row !in 0 until rows || col !in 0 until cols) return false
            if (grid[row][col] != word[wordIndex]) return false
            return search(row + dRow, col + dCol, wordIndex + 1, dRow, dCol)
        }

        val directions = arrayOf(
            intArrayOf(1, 0), // S
            intArrayOf(0, -1), // W
            intArrayOf(-1, 0), // N
            intArrayOf(0, 1), // E
            intArrayOf(1, 1), // SE
            intArrayOf(1, -1), // SW
            intArrayOf(-1, -1), // NW
            intArrayOf(-1, 1) // NE
        )

        var count = 0
        for (row in 0 until rows) {
            for (col in 0 until cols) {
                if (grid[row][col] != 'X') continue
                for ((dRow, dCol) in directions) {
                    if (search(row, col, 0, dRow, dCol)) {
                        count++
                    }
                }
            }
        }
        return count
    }

    fun countPatterns(grid: Array<CharArray>): Int {
        fun matchesPattern(grid: Array<CharArray>, startRow: Int, startCol: Int, pattern: Array<String>): Boolean {
            for (i in 0..2) {
                for (j in 0..2) {
                    if (pattern[i][j] == '.') continue
                    if (grid[startRow + i][startCol + j] != pattern[i][j]) {
                        return false
                    }
                }
            }
            return true
        }

        val patterns = arrayOf(
            arrayOf("M.S", ".A.", "M.S"),
            arrayOf("M.M", ".A.", "S.S"),
            arrayOf("S.S", ".A.", "M.M"),
            arrayOf("S.M", ".A.", "S.M")
        )

        val rows = grid.size
        val cols = grid[0].size

        var count = 0
        for (row in 1 until rows - 1) {
            for (col in 1 until cols - 1) {
                if (grid[row][col] != 'A') continue
                for (pattern in patterns) {
                    if (matchesPattern(grid, row - 1, col - 1, pattern)) {
                        count++
                    }
                }
            }
        }
        return count
    }

    fun part1(input: List<String>): Int {
        return countWordInGrid(prepareInput(input))
    }

    fun part2(input: List<String>): Int {
        return countPatterns(prepareInput(input))
    }

    check(part1(readInput("Day04")) == 18)
    check(part2(readInput("Day04")) == 9)

    val input = readInput("Day04_test")
    println(part1(input)) // 2644
    println(part2(input)) // 1952
}

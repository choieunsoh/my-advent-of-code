// Day 12: PluGarden Groups
// https://adventofcode.com/2024/day/12

import java.io.File
import java.util.*

fun readInput(filename: String): List<List<Char>> {
    return File("$filename.txt").readLines()
        .flatMap { it.split(Regex("\\s+")) }
        .map { it.trim().toList() }
}

fun calculateTotalPrice(map: List<List<Char>>, enabledDiscount: Boolean, debug: Boolean = false): Int {
    val rows = map.size
    val cols = map[0].size
    val visited = Array(rows) { BooleanArray(cols) }

    var totalPrice = 0
    for (row in 0 until rows) {
        for (col in 0 until cols) {
            if (visited[row][col]) continue

            val (area, perimeter, edges) = calculate(map, visited, row, col, map[row][col])
            val price = if (enabledDiscount) edges else perimeter
            totalPrice += area * price
            if (debug) println("${map[row][col]} $area $perimeter $edges ${area * price} $totalPrice")
        }
    }
    return totalPrice
}

fun calculate(
    map: List<List<Char>>, 
    visited: Array<BooleanArray>, 
    startRow: Int, 
    startCol: Int, 
    plant: Char
): Triple<Int, Int, Int> {
    val rows = map.size
    val cols = map[0].size

    var area = 0
    var perimeter = 0
    var edgeCount = 0
    val edges = mutableSetOf<String>()

    val queue: Queue<Pair<Int, Int>> = LinkedList()
    queue.add(Pair(startRow, startCol))
    visited[startRow][startCol] = true

    while (queue.isNotEmpty()) {
        val (row, col) = queue.poll()
        area++

        val neighbors = getNeighbors(row, col)
        for (index in 0 until neighbors.size) {
            val (newRow, newCol) = neighbors[index]
            if (newRow !in map.indices || newCol !in map[0].indices || map[newRow][newCol] != plant) {
                perimeter++

                val key = "$newRow,$newCol,${index}"
                edgeCount++
                edges.add(key)

                val borders = getNeighbors(newRow, newCol)
                for ((borderRow, borderCol) in borders) {
                    val borderKey = "$borderRow,$borderCol,${index}"
                    if (edges.contains(borderKey)) {
                        edgeCount--
                    }
                }
            } else if (!visited[newRow][newCol]) {
                visited[newRow][newCol] = true
                queue.add(Pair(newRow, newCol))
            }
        }
    }
    return Triple(area, perimeter, edgeCount)
}

fun getNeighbors(row: Int, col: Int): List<Pair<Int, Int>> {
    val directions = listOf(1, 0, -1, 0, 1)
    val neighbors = mutableListOf<Pair<Int, Int>>()
    for (d in 0 until 4) {
        val newRow = row + directions[d]
        val newCol = col + directions[d + 1]
        neighbors.add(Pair(newRow, newCol))
    }
    return neighbors
}

fun part1(map: List<List<Char>>, debug: Boolean = false): Int {
    return calculateTotalPrice(map, false, debug)
}

fun part2(map: List<List<Char>>, debug: Boolean = false): Int {
    return calculateTotalPrice(map, true, debug)
}

fun main() {
    val filename = "Day12"
    val map = readInput(filename)
    val mapDemo = readInput("${filename}_demo")
    val mapTest = readInput("${filename}_test")

    println("Part 1 Demo: ${part1(mapDemo, true)}") // 140
    println("Part 1: ${part1(map)}") // 1930
    println("Part 1 Test: ${part1(mapTest)}") // 1549354

    println("Part 2 Demo: ${part2(mapDemo, true)}") // 80
    println("Part 2: ${part2(map)}") // 1206
    println("Part 2 Test: ${part2(mapTest)}") // 937032
}

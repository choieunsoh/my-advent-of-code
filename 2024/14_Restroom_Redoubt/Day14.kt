// Day 14: Restroom Redoubt
// https://adventofcode.com/2024/day/14

import java.io.File
import kotlin.math.max

data class Robot(var x: Int, var y: Int, val dx: Int, val dy: Int)

fun readInput(filename: String): List<String> {
    return File("$filename.txt").readLines()
}

fun buildRobots(config: List<String>): Triple<List<Robot>, Int, Int> {
    val robots = config.map { toRobot(it) }
    val tall = robots.maxOf { it.y } + 1
    val wide = robots.maxOf { it.x } + 1
    return Triple(robots, tall, wide)
}

fun toRobot(line: String): Robot {
    // p=2,4 v=2,-3
    val (p, v) = line.split(" ")
    val (x, y) = p.split("=")[1].split(",").map { it.toInt() }
    val (dx, dy) = v.split("=")[1].split(",").map { it.toInt() }
    return Robot(x, y, dx, dy)
}

fun moveRobots(robots: List<Robot>, moves: Int, wide: Int, tall: Int): List<Robot> {
    return robots.map { robot ->
        val newX = ((robot.x + robot.dx * moves) % wide + wide) % wide
        val newY = ((robot.y + robot.dy * moves) % tall + tall) % tall
        robot.copy(x = newX, y = newY)
    }
}

fun splitRegions(robots: List<Robot>, wide: Int, tall: Int): List<List<Robot>> {
    val midX = wide / 2
    val midY = tall / 2
    val regions = List(4) { mutableListOf<Robot>() }

    robots.forEach { robot ->
        val (x, y) = robot
        when {
            x == midX || y == midY -> return@forEach
            x < midX && y < midY -> regions[0].add(robot) // Top-left
            x >= midX && y < midY -> regions[1].add(robot) // Top-right
            x < midX && y >= midY -> regions[2].add(robot) // Bottom-left
            x >= midX && y >= midY -> regions[3].add(robot) // Bottom-right
        }
    }

    return regions
}

fun printRobots(robots: List<Robot>, wide: Int, tall: Int, print: Boolean = true): String {
    val grid = Array(tall) { CharArray(wide) { '.' } }
    robots.forEach { robot ->
        grid[robot.y][robot.x] = '#'
    }
    val pattern = grid.joinToString("\n") { it.joinToString("") }
    if (print) println("$pattern\n")
    return pattern
}

fun isUniquePositions(robots: List<Robot>): Boolean {
    val positions = robots.map { "${it.x},${it.y}" }.toSet()
    return positions.size == robots.size
}

fun part1(input: List<String>, moves: Int = 100, debug: Boolean = false): Int {
    val (robots, tall, wide) = buildRobots(input)
    val movedRobots = moveRobots(robots, moves, wide, tall)
    val regions = splitRegions(movedRobots, wide, tall)
    if (debug) {
        println(regions)
        printRobots(movedRobots, wide, tall)
    }
    return regions.fold(1) { factor, region -> factor * (region.size.takeIf { it > 0 } ?: 1) }
}

fun part2(input: List<String>): Int {
    val (robots, tall, wide) = buildRobots(input)
    var currentRobots = robots
    val patternSet = mutableMapOf<String, Pair<Int, List<Robot>>>()
    var moves = 0

    while (true) {
        moves++
        currentRobots = moveRobots(currentRobots, 1, wide, tall)
        if (isUniquePositions(currentRobots)) {
            val pattern = printRobots(currentRobots, wide, tall, false)
            if (patternSet.containsKey(pattern)) {
                println("Found a loop! $moves moves")
                break
            }
            patternSet[pattern] = moves to currentRobots
        }
    }

    println("Total unique robot positions: ${patternSet.size}")
    patternSet.values.forEach { (moves, robots) ->
        println("Moves: $moves")
        printRobots(robots, wide, tall)
    }
    return 0
}

fun main() {
    val filename = "Day14"
    val input = readInput(filename)
    val inputTest = readInput("${filename}_test")

    println("Part 1: ${part1(input, debug = true)}") // 12
    println("Part 1: ${part1(inputTest, debug = true)}") // 218619120

    println("Part 2: ${part2(input)}") // 0
    println("Part 2: ${part2(inputTest)}") // 7055
}

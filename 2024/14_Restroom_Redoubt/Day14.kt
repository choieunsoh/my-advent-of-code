// Day 14: Restroom Redoubt
// https://adventofcode.com/2024/day/14

import java.io.File
import kotlin.math.max
import java.awt.Color
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import javax.imageio.ImageIO

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

fun writeSnapshot(robots: List<Robot>, wide: Int, tall: Int, seconds: Int, scale: Int = 10) {
    val grid = Array(tall) { CharArray(wide) { '.' } }
    robots.forEach { robot ->
        grid[robot.y][robot.x] = '#'
    }

    val baseImage  = BufferedImage(wide, tall, BufferedImage.TYPE_INT_RGB)

    for (y in 0 until tall) {
        for (x in 0 until wide) {
            val color = if (grid[y][x] == '.') Color.BLACK else Color.GREEN
            baseImage .setRGB(x, y, color.rgb)
        }
    }

    // Scale the image
    val scaledWidth = wide * scale
    val scaledHeight = tall * scale
    val scaledImage = BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_RGB)
    val g2d: Graphics2D = scaledImage.createGraphics()

    // Draw the base image into the scaled image
    g2d.drawImage(baseImage, 0, 0, scaledWidth, scaledHeight, null)
    g2d.dispose()

    val filename = "images/frame_%04d.png".format(seconds)
    ImageIO.write(scaledImage, "png", File(filename))
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

fun part2(input: List<String>, scale: Int = 10): Int {
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
            writeSnapshot(currentRobots, wide, tall, moves, scale)
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

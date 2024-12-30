// Day 2: I Was Told There Would Be No Math
// https://adventofcode.com/2015/day/2

import java.nio.file.Files
import java.nio.file.Paths

fun readInput(name: String): String {
    return Files.readString(Paths.get("$name.txt")).trim()
}

data class Box(val l: Int, val w: Int, val h: Int) {
    fun calculateWrappingPaper(): Int {
        val sides = listOf(l * w, w * h, h * l)
        val smallestSide = sides.minOrNull() ?: 0
        return 2 * sides.sum() + smallestSide
    }

    fun calculateWrappingRibbon(): Int {
        val maxSide = listOf(l, w, h).maxOrNull() ?: 0
        val otherSides = l + w + h - maxSide
        val perimeter = 2 * otherSides
        val volume = l * w * h
        return perimeter + volume
    }
}

fun prepareData(input: String): List<Box> {
    return input.split("\r\n").map { box ->
        val (l, w, h) = box.split("x").map { it.toInt() }
        Box(l, w, h)
    }
}

fun part1(input: String): Int {
    val boxes = prepareData(input)
    return boxes.sumOf { it.calculateWrappingPaper() }
}

fun part2(input: String): Int {
    val boxes = prepareData(input)
    return boxes.sumOf { it.calculateWrappingRibbon() }
}

fun main() {
    val day = "Day02"
    val input = readInput(day)
    val inputTest = readInput("${day}_test")

    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")

    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
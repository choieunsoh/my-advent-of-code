// Day 11: Plutonian Pebbles
// https://adventofcode.com/2024/day/11

import java.io.File

fun readInput(filename: String) = File("$filename.txt").readText().trim().split(" ").map { it.toLong() }

val memo = mutableMapOf<Pair<Long, Int>, Long>()

fun countStones(num: Long, blinks: Int): Long {
    val key = num to blinks
    memo[key]?.let { return it }

    val stones = when {
        blinks == 0 -> 1L
        num == 0L -> countStones(1L, blinks - 1)
        else -> {
            val numStr = num.toString()
            val len = numStr.length
            if (len % 2 != 0) {
                countStones(2024L * num, blinks - 1)
            } else {
                val half = len / 2
                val leftNum = numStr.substring(0, half).toLong()
                val rightNum = numStr.substring(half).toLong()
                countStones(leftNum, blinks - 1) + countStones(rightNum, blinks - 1)
            }
        }
    }

    memo[key] = stones
    return stones
}

fun part1(nums: List<Long>): Long {    
    return nums.sumOf { countStones(it, 25) }
}

fun part2(nums: List<Long>): Long {    
    return nums.sumOf { countStones(it, 75) }
}

fun main() {
    val input = readInput("Day11")
    val inputTest = readInput("Day11_test")

    println("Part 1: ${part1(input)}") // 55312
    println("Part 1 Test: ${part1(inputTest)}") // 239714

    println("Part 2: ${part2(input)}") // 65601038650482
    println("Part 2 Test: ${part2(inputTest)}") // 284973560658514
}

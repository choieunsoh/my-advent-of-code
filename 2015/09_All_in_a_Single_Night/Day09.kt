// Day 9: All in a Single Night
// https://adventofcode.com/2015/day/9

import java.nio.file.Files
import java.nio.file.Paths

fun permutations(array: List<String>): List<List<String>> {
    val result = mutableListOf<List<String>>()
    val used = BooleanArray(array.size)

    fun backtrack(path: MutableList<String>) {
        if (path.size == array.size) {
            result.add(ArrayList(path))
            return
        }
        for (i in array.indices) {
            if (used[i]) continue
            used[i] = true
            path.add(array[i])
            backtrack(path)
            path.removeAt(path.size - 1)
            used[i] = false
        }
    }

    backtrack(mutableListOf())
    return result
}

fun calculateDistances(input: String): Pair<Int, Int> {
    val lines = input.split("\r\n")
    val map = mutableMapOf<String, MutableMap<String, Int>>()
    val uniqueCities = mutableSetOf<String>()

    for (line in lines) {
        val (from, to, distance) = Regex("""(\w+) to (\w+) = (\d+)""").find(line)!!.destructured
        map.computeIfAbsent(from) { mutableMapOf() }[to] = distance.toInt()
        map.computeIfAbsent(to) { mutableMapOf() }[from] = distance.toInt()
        uniqueCities.add(from)
        uniqueCities.add(to)
    }

    var shortestDistance = Int.MAX_VALUE
    var longestDistance = 0
    val permuteCities = permutations(uniqueCities.toList())
    for (cities in permuteCities) {
        var distance = 0
        for (i in 0 until cities.size - 1) {
            val from = cities[i]
            val to = cities[i + 1]
            distance += map[from]!![to]!!
        }
        shortestDistance = minOf(shortestDistance, distance)
        longestDistance = maxOf(longestDistance, distance)
    }

    return Pair(shortestDistance, longestDistance)
}

fun part1(input: String): Int {
    return calculateDistances(input).first
}

fun part2(input: String): Int {
    return calculateDistances(input).second
}

fun main() {
    val day = "Day09"
    val input = Files.readString(Paths.get("$day.txt")).trim()
    val inputTest = Files.readString(Paths.get("${day}_test.txt")).trim()

    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")
    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
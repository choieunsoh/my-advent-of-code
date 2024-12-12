// Day 5: Print Queue
// https://adventofcode.com/2024/day/5

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().trim()

fun main() {
    data class ParsedData(
        val rules: List<Pair<Int, Int>>,
        val updates: List<List<Int>>
    )

    fun prepareInput(data: String): ParsedData {
        val sections = data.split("\n\n")

        val rules = sections[0]
            .lineSequence()
            .map { line ->
                val parts = line.split("|")
                parts[0].toInt() to parts[1].toInt()
            }.toList()

        val updates = sections[1]
            .lineSequence()
            .map { line ->
                line.split(",").map { it.toInt() }
            }.toList()

        return ParsedData(rules, updates)
    }

    fun isValidOrder(rules: List<Pair<Int, Int>>, map: Map<Int, Int>): Boolean {
        return rules.all { (x, y) ->
            val xIndex = map[x] ?: -1
            val yIndex = map[y] ?: -1
            xIndex == -1 || yIndex == -1 || xIndex <= yIndex
        }
    }

    fun reorderUnsortedList(rules: List<Pair<Int, Int>>, list: List<Int>): List<Int> {
        val graph = list.associateWith { mutableListOf<Int>() }
        val inDegree = list.associateWith { 0 }.toMutableMap()

        for ((x, y) in rules) {
            if (x in graph && y in graph) {
                graph[x]?.add(y)
                inDegree[y] = inDegree.getValue(y) + 1
            }
        }

        val queue = ArrayDeque(inDegree.filterValues { it == 0 }.keys)
        val sortedList = mutableListOf<Int>()

        while (queue.isNotEmpty()) {
            val node = queue.removeFirst()
            sortedList.add(node)
            for (neighbor in graph[node].orEmpty()) {
                inDegree[neighbor] = inDegree.getValue(neighbor) - 1
                if (inDegree[neighbor] == 0) {
                    queue.add(neighbor)
                }
            }
        }
        return sortedList
    }

    fun findMiddleSum(rules: List<Pair<Int, Int>>, updates: List<List<Int>>): Int {
        return updates.sumOf { update ->
            val map = update.withIndex().associate { it.value to it.index }
            if (isValidOrder(rules, map)) update[update.size / 2] else 0
        }
    }

    fun reorderAndSum(rules: List<Pair<Int, Int>>, updates: List<List<Int>>): Int {
        return updates.sumOf { update ->
            val map = update.withIndex().associate { it.value to it.index }
            if (isValidOrder(rules, map)) 0
            else {
                val sortedList = reorderUnsortedList(rules, update)
                sortedList[update.size / 2]
            }
        }
    }

    fun part1(input: String): Int {
        val (rules, updates) = prepareInput(input)
        return findMiddleSum(rules, updates)
    }

    fun part2(input: String): Int {
        val (rules, updates) = prepareInput(input)
        return reorderAndSum(rules, updates)
    }

    var input = readInput("Day05")
    println(part1(input)) // 143
    println(part2(input)) // 123

    input = readInput("Day05_test")
    println(part1(input)) // 6612
    println(part2(input)) // 4944
}

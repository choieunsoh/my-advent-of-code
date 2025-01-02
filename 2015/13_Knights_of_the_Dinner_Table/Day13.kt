// Day 13: Knights of the Dinner Table
// https://adventofcode.com/2015/day/13

fun <T> permutations(list: List<T>): List<List<T>> {
    if (list.isEmpty()) return listOf(emptyList())
    
    return list.flatMap { item ->
        val remaining = list - item
        permutations(remaining).map { subPerm -> listOf(item) + subPerm }
    }
}

fun prepareData(input: String): Map<String, Map<String, Int>> {
    val pattern = """(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\.""".toRegex()
    val result = mutableMapOf<String, MutableMap<String, Int>>()
    
    input.split("\r\n")
        .mapNotNull { line -> pattern.matchEntire(line)?.groupValues }
        .forEach { (_, name, gainLose, value, next) ->
            val happiness = value.toInt() * if (gainLose == "gain") 1 else -1
            if (!result.containsKey(name)) {
                result[name] = mutableMapOf()
            }
            result[name]?.put(next, happiness)
        }
    
    return result
}

fun calculateHappiness(input: String, includeMe: Boolean): Int {
    val map = prepareData(input)
    val names = map.keys.toList()
    
    return permutations(names).maxOf { arrangement ->
        val n = arrangement.size
        val pairs = if (includeMe) n - 1 else n
        (0 until pairs).sumOf { i ->
            val current = arrangement[i]
            val next = arrangement[(i + 1) % n]
            map[current]!![next]!! + map[next]!![current]!!
        }
    }
}

fun part1(input: String) = calculateHappiness(input, false)
fun part2(input: String) = calculateHappiness(input, true)

fun main() {
    val input = java.io.File("Day13.txt").readText()
    val inputTest = java.io.File("Day13_test.txt").readText()

    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")
    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
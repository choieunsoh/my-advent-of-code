// Day 8: Matchsticks
// https://adventofcode.com/2015/day/8

import java.nio.file.Files
import java.nio.file.Paths

val ESCAPE_SEQUENCES = mapOf(
    "SLASH" to Regex("""\\{2}"""),
    "QUOTE" to Regex("""\\\""""),
    "ASCII" to Regex("""\\x[0-9a-f]{2}""")
)

fun countEscapeSequences(line: String): Map<String, Int> {
    val trimmedLine = line.substring(1, line.length - 1)
    return mapOf(
        "slashCount" to ESCAPE_SEQUENCES["SLASH"]!!.findAll(trimmedLine).count(),
        "quoteCount" to ESCAPE_SEQUENCES["QUOTE"]!!.findAll(trimmedLine).count(),
        "asciiCount" to ESCAPE_SEQUENCES["ASCII"]!!.findAll(trimmedLine).count()
    )
}

fun calculateAddedLength(line: String, initialLength: Int, adjustments: Map<String, Int>): Int {
    val counts = countEscapeSequences(line)
    return initialLength +
            adjustments["slash"]!! * counts["slashCount"]!! +
            adjustments["quote"]!! * counts["quoteCount"]!! +
            adjustments["ascii"]!! * counts["asciiCount"]!!
}

fun part1(input: String): Int {
    val lines = input.split("\r\n")
    val adjustments = mapOf(
        "slash" to 1, // \\ -> \
        "quote" to 1, // \" -> "
        "ascii" to 3  // \xAA -> single character
    )
    return lines.sumOf { calculateAddedLength(it, 2, adjustments) }
}

fun part2(input: String): Int {
    val lines = input.split("\r\n")
    val adjustments = mapOf(
        "slash" to 2, // \\ -> \\\\
        "quote" to 2, // \" -> \\""
        "ascii" to 1  // \xAA -> \\xAA
    )
    return lines.sumOf { calculateAddedLength(it, 4, adjustments) }
}

fun main() {
    val day = "Day08"
    val input = Files.readString(Paths.get("$day.txt")).trim()
    val inputTest = Files.readString(Paths.get("${day}_test.txt")).trim()

    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")
    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
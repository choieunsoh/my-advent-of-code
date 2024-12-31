// Day 5: Doesn't He Have Intern-Elves For This?
// https://adventofcode.com/2015/day/5

import java.nio.file.Files
import java.nio.file.Paths

fun readInput(name: String): String {
    return Files.readString(Paths.get("$name.txt")).trim()
}

fun hasTripleVowels(str: String): Boolean {
    val pattern = "[aeiou]".toRegex()
    val vowels = pattern.findAll(str).count()
    return vowels > 2
}

fun hasDoubleLetters(str: String): Boolean {
    val pattern = "([a-z])\\1".toRegex()
    return pattern.containsMatchIn(str)
}

fun hasNoForbiddenPairs(str: String): Boolean {
    val pattern = "ab|cd|pq|xy".toRegex()
    return !pattern.containsMatchIn(str)
}

fun hasTwiceLetterPair(str: String): Boolean {
    val pattern = "([a-z]{2})[a-z]*\\1".toRegex()
    return pattern.containsMatchIn(str)
}

fun hasSingleLetterBetweenThem(str: String): Boolean {
    val pattern = "([a-z])[a-z]\\1".toRegex()
    return pattern.containsMatchIn(str)
}

fun isNiceStringPart1(str: String): Boolean {
    return hasTripleVowels(str) && hasDoubleLetters(str) && hasNoForbiddenPairs(str)
}

fun isNiceStringPart2(str: String): Boolean {
    return hasTwiceLetterPair(str) && hasSingleLetterBetweenThem(str)
}

fun part1(input: String): Int {
    return input.split("\r\n").count { isNiceStringPart1(it) }
}

fun part2(input: String): Int {
    return input.split("\r\n").count { isNiceStringPart2(it) }
}

fun main() {
    val day = "Day05"
    val input = readInput(day)
    val inputTest = readInput("${day}_test")

    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")

    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
// Day 4: The Ideal Stocking Stuffer
// https://adventofcode.com/2015/day/4

import java.security.MessageDigest

fun md5(input: String): String {
    val bytes = MessageDigest.getInstance("MD5").digest(input.toByteArray())
    return bytes.joinToString("") { "%02x".format(it) }
}

fun part1(input: String): Int {
    var runningNumber = 0
    while (!md5("$input$runningNumber").startsWith("00000")) {
        runningNumber++
    }
    return runningNumber
}

fun part2(input: String): Int {
    var runningNumber = 0
    while (!md5("$input$runningNumber").startsWith("000000")) {
        runningNumber++
    }
    return runningNumber
}

fun main() {
    val input1 = "abcdef"
    val input2 = "pqrstuv"
    val inputTest = "bgvyzdsv"

    println("Part 1: ${part1(input1)}") // 609043
    println("Part 1: ${part1(input2)}") // 1048970
    println("Part 1: ${part1(inputTest)}") // 254575

    println("Part 2: ${part2(input1)}") // 6742839
    println("Part 2: ${part2(input2)}") // 5714438
    println("Part 2: ${part2(inputTest)}") // 1038736
}
// Day 10: Elves Look, Elves Say
// https://adventofcode.com/2015/day/10

fun lookAndSay(sequence: String): String {
    val result = StringBuilder()
    var currentChar = sequence[0]
    var count = 1

    for (i in 1..sequence.length) {
        if (i == sequence.length || sequence[i] != currentChar) {
            result.append(count).append(currentChar)
            if (i < sequence.length) {
                currentChar = sequence[i]
                count = 1
            }
        } else {
            count++
        }
    }

    return result.toString()
}

fun generateLookAndSaySequence(input: String, iterations: Int): Int {
    var sequence = input
    repeat(iterations) {
        sequence = lookAndSay(sequence)
    }
    return sequence.length
}

fun part1(input: String): Int {
    return generateLookAndSaySequence(input, 40)
}

fun part2(input: String): Int {
    return generateLookAndSaySequence(input, 50)
}

fun main() {
    val input = "1"
    val inputTest = "1113222113"

    println("Part 1: ${part1(input)}") // 82350
    println("Part 1: ${part1(inputTest)}") // 252594

    println("Part 2: ${part2(input)}") // 1166642
    println("Part 2: ${part2(inputTest)}") // 3579328
}
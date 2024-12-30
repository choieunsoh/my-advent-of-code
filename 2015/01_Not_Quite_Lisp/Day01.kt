// Day 1: Not Quite Lisp
// https://adventofcode.com/2015/day/1

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().trim()

fun main() {
    fun countChar(str: String, char: Char): Int {
        return str.count { it == char }
    }
    
    fun part1(input: String): Int {
        return countChar(input, '(') - countChar(input, ')')
    }

    fun part2(input: String): Int {
        return input.foldIndexed(0) { index, floor, char ->
            val newFloor = floor + if (char == '(') 1 else -1
            if (newFloor == -1) return index + 1
            newFloor
        }
        -1
    }

    var input = readInput("Day01")
    var input2 = readInput("Day01_2")
    var inputTest = readInput("Day01_test")

    println(part1(input))
    println(part1(inputTest))

    println(part2(input2))
    println(part2(inputTest))
}
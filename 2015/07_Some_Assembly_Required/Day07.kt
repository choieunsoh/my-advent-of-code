// Day 7: Some Assembly Required
// https://adventofcode.com/2015/day/7

import java.nio.file.Files
import java.nio.file.Paths

data class Instruction(
    val operation: String,
    val input1: String,
    val input2: String? = null,
    val output: String
)

val MASK = 0xFFFF
val OPERATIONS = mapOf(
    "ASSIGN" to { a: Int, _: Int? -> a and MASK },
    "NOT" to { a: Int, _: Int? -> a.inv() and MASK },
    "AND" to { a: Int, b: Int? -> (a and (b ?: 0)) and MASK },
    "OR" to { a: Int, b: Int? -> (a or (b ?: 0)) and MASK },
    "LSHIFT" to { a: Int, b: Int? -> (a shl (b ?: 0)) and MASK },
    "RSHIFT" to { a: Int, b: Int? -> (a shr (b ?: 0)) and MASK }
)

fun parseInstruction(line: String): Instruction {
    val parts = line.split(" ")
    return when (parts.size) {
        3 -> Instruction("ASSIGN", parts[0], null, parts[2])
        4 -> Instruction("NOT", parts[1], null, parts[3])
        else -> Instruction(parts[1], parts[0], parts[2], parts[4])
    }
}

fun prepareData(input: String): List<Instruction> =
    input.split("\r\n").map(::parseInstruction)

fun executeCircuit(instructions: List<Instruction>, target: String, initialValues: Map<String, Int> = emptyMap()): Int {
    val wires = initialValues.toMutableMap()
    val executed = wires.keys.toMutableSet()

    fun isValid(input: String) = input.toIntOrNull() != null || input in wires
    fun getValue(input: String) = input.toIntOrNull() ?: wires[input]!!

    while (executed.size < instructions.size) {
        for (inst in instructions) {
            if (inst.output in executed || !isValid(inst.input1) || (inst.input2 != null && !isValid(inst.input2))) {
                continue
            }
            val value1 = getValue(inst.input1)
            val value2 = inst.input2?.let(::getValue)
            wires[inst.output] = OPERATIONS[inst.operation]!!(value1, value2)
            executed.add(inst.output)
        }
    }
    return wires[target]!!
}

fun part1(input: String) = executeCircuit(prepareData(input), "a")

fun part2(input: String): Int {
    val instructions = prepareData(input)
    val aValue = executeCircuit(instructions, "a")
    return executeCircuit(instructions, "a", mapOf("b" to aValue))
}

fun main() {
    val day = "Day07"
    val input = Files.readString(Paths.get("$day.txt"))
    val inputTest = Files.readString(Paths.get("${day}_test.txt"))

    println("Part 1: ${part1(input)}")
    println("Part 1: ${part1(inputTest)}")
    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(inputTest)}")
}
// Day 13: Claw Contraption
// https://adventofcode.com/2024/day/13

import java.io.File
import kotlin.math.*

data class Button(val x: Long, val y: Long, val cost: Long)
data class Prize(val x: Long, val y: Long)
data class ClawMachine(
    val buttonA: Button,
    val buttonB: Button,
    val prize: Prize,
    var a: Long = 0,
    var b: Long = 0,
    var win: Boolean = false,
    var totalCost: Long = 0
)

fun readInput(filename: String): List<List<String>> {
    return File("$filename.txt")
        .readText()
        .split("\r\n\r\n")
        .map { it.split("\r\n") }
}

fun buildClawMachines(config: List<List<String>>, conversionError: Long, limitToken: Long): List<ClawMachine> {
    return config.map { machineConfig ->
        val buttonA = parseButton(machineConfig[0], 3)
        val buttonB = parseButton(machineConfig[1], 1)
        val prize = parsePrize(machineConfig[2], conversionError)

        val machine = ClawMachine(buttonA, buttonB, prize)
        val (a, b, win) = solveLinearEquations(machine, limitToken)

        machine.a = a
        machine.b = b
        machine.win = win
        machine.totalCost = if (win) a * buttonA.cost + b * buttonB.cost else 0L

        machine
    }
}

fun parseButton(buttonConfig: String, cost: Long): Button {
    val regex = Regex("""Button \w: X([+-]?\d+), Y([+-]?\d+)""")
    val match = regex.find(buttonConfig) ?: throw IllegalArgumentException("Invalid button config: $buttonConfig")
    val (x, y) = match.destructured
    return Button(x.toLong(), y.toLong(), cost)
}

fun parsePrize(prizeConfig: String, error: Long): Prize {
    val regex = Regex("""Prize: X=(\d+), Y=(\d+)""")
    val match = regex.find(prizeConfig) ?: throw IllegalArgumentException("Invalid prize config: $prizeConfig")
    val (x, y) = match.destructured
    return Prize(x.toLong() + error, y.toLong() + error)
}

fun solveLinearEquations(machine: ClawMachine, limit: Long): Triple<Long, Long, Boolean> {
    val (a1, b1) = listOf(machine.buttonA.x, machine.buttonB.x)
    val (a2, b2) = listOf(machine.buttonA.y, machine.buttonB.y)
    val (c1, c2) = listOf(machine.prize.x, machine.prize.y)

    val factor = (a1 * b2 - a2 * b1).toDouble()
    if (factor == 0.0) return Triple(0L, 0L, false) // No unique solution

    val a = ((c1 * b2 - c2 * b1).toDouble() / factor)
    val b = ((a1 * c2 - a2 * c1).toDouble() / factor)

    val win = isWin(a, b, limit);
    if (!win) return Triple(0L, 0L, false)

    return Triple(a.toLong(), b.toLong(), win)
}

fun isWin(a: Double, b: Double, limit: Long): Boolean {
    if (limit > 0 && (a.toLong() > limit || b.toLong() > limit)) return false
    return !hasDecimal(a) && !hasDecimal(b)
}

fun hasDecimal(value: Double): Boolean {
    return value % 1 != 0.0
}

fun part1(input: List<List<String>>, error: Long = 0L, limit: Long = 100L, debug: Boolean = false): Long {
    val machines = buildClawMachines(input, error, limit)
    if (debug) println(machines)
    return machines.sumOf { it.totalCost }
}

fun part2(input: List<List<String>>, error: Long = ERROR, limit: Long = 0L, debug: Boolean = false): Long {
    val machines = buildClawMachines(input, error, limit)
    return machines.sumOf { it.totalCost }
}

const val ERROR = 10_000_000_000_000L

fun main() {
    val filename = "Day13"
    val input = readInput(filename)
    val inputTest = readInput("${filename}_test")

    println("Part 1: ${part1(input, debug = true)}") // 480
    println("Part 1 Test: ${part1(inputTest)}") // 36758

    println("Part 2: ${part2(input)}") // 875318608908
    println("Part 2 Test: ${part2(inputTest)}") // 76358113886726
}

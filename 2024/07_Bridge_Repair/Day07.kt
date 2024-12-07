// Day 7: Bridge Repair
// https://adventofcode.com/2024/day/7

import kotlin.io.path.Path
import kotlin.io.path.readText
fun readInput(name: String) = Path("$name.txt").readText().split("\n").toTypedArray()

data class Equation(val target: Long, val nums: LongArray)

fun main() {
    fun parsedEquations(input: Array<String>): Array<Equation> {
        return input.map { 
            val (target, numbers) = it.split(": ")
            val nums = numbers.split(" ").map { it.toLong() }.toLongArray()
            Equation(target.toLong(), nums)
        }.toTypedArray()
    }

    fun evaluate(equation: Equation, enabledConcat: Boolean, index: Int = 0, currentValue: Long = equation.nums[0], expression: String = equation.nums[0].toString()): Long? {
        if (index == equation.nums.size - 1) {
            if (currentValue == equation.target) {
                return currentValue
            }
            return null
        }

        val nextIndex = index + 1
        val nextValue = equation.nums[nextIndex]
        
        val addValue = currentValue + nextValue
        val addExpression = "$expression + $nextValue"
        val addResult = evaluate(equation, enabledConcat, nextIndex, addValue, addExpression)
        if (addResult != null) return addResult

        val multiplyValue = currentValue * nextValue
        val multiplyExpression = "$expression * $nextValue"
        val multiplyResult = evaluate(equation, enabledConcat, nextIndex, multiplyValue, multiplyExpression)
        if (multiplyResult != null) return multiplyResult

        if (enabledConcat) {
            val concatValue = "$currentValue$nextValue".toLong()
            val concatExpression = "$expression || $nextValue"
            val concatResult = evaluate(equation, enabledConcat, nextIndex, concatValue, concatExpression)
            if (concatResult != null) return concatResult
        }

        return null
    }

    fun solveEquations(equations: Array<Equation>, enabledConcat: Boolean = false): Long {
        return equations.map { equation ->
            val solution = evaluate(equation, enabledConcat)
            solution ?: 0
        }.sum()
    }

    fun part1(input: Array<String>): Long {
        val equations = parsedEquations(input)
        return solveEquations(equations)
    }

    fun part2(input: Array<String>): Long {
        val equations = parsedEquations(input)
        return solveEquations(equations, true)
    }

    println(part1(readInput("Day07"))) // 3749
    println(part2(readInput("Day07"))) // 11387

    println(part1(readInput("Day07_test"))) // 4122618559853
    println(part2(readInput("Day07_test"))) // 227615740238334
    
}

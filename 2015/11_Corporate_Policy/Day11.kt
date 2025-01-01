// Day 11: Corporate Policy
// https://adventofcode.com/2015/day/11

private val FORBIDDEN_PATTERN = Regex("[iol]")
private val DOUBLE_PAIRS_PATTERN = Regex("([a-z])\\1.*([a-z])\\2")
private val STRAIGHT_PATTERN = Regex(
    "abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz"
)

fun incrementPassword(str: String): String {
    val sb = StringBuilder(str)
    var i = sb.length - 1
    
    while (i >= 0) {
        if (sb[i] == 'z') {
            sb.setCharAt(i--, 'a')
        } else {
            sb.setCharAt(i, sb[i] + 1)
            break
        }
    }
    
    return sb.toString()
}

fun isValidPassword(password: String): Boolean = 
    !password.contains(FORBIDDEN_PATTERN) && 
    password.contains(DOUBLE_PAIRS_PATTERN) && 
    password.contains(STRAIGHT_PATTERN)

fun part1(input: String): String {
    var current = StringBuilder(input)
    while (!isValidPassword(current.toString())) {
        current = StringBuilder(incrementPassword(current.toString()))
    }
    return current.toString()
}

fun part2(input: String) = part1(incrementPassword(part1(input)))

fun main() {
    val input = part1("abcdefgh")
    val input2 = part1("ghijklmn")
    val inputTest = part1("hepxcrrq")

    println("Part 1: ${input}")
    println("Part 1: ${input2}")
    println("Part 1: ${inputTest}")

    println("Part 2: ${part2(input)}")
    println("Part 2: ${part2(input2)}")
    println("Part 2: ${part2(inputTest)}")
}
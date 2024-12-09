// Day 9: Disk Fragmenter
// https://adventofcode.com/2024/day/9

import java.io.File

fun readInput(filename: String): List<Int> {
    return File("$filename.txt").readText().trim().map { it.digitToInt() }
}

fun createFileSystem(input: List<Int>, flatten: Boolean): List<MutableList<Int?>> {
    val fragments = mutableListOf<MutableList<Int?>>()
    var fileId = 0
    var isFileBlock = true

    for (size in input) {
        val block = MutableList(size) { if (isFileBlock) fileId else null }
        if (flatten) {
            fragments.addAll(block.map { mutableListOf(it) })
        } else {
            fragments.add(block)
        }
        if (isFileBlock) fileId++
        isFileBlock = !isFileBlock
    }

    return fragments
}

fun moveFileLeftmost(fragments: MutableList<Int?>) {
    var left = 0
    var right = fragments.size - 1

    while (left < right) {
        while (left < fragments.size && fragments[left] != null) left++
        while (right >= 0 && fragments[right] == null) right--

        if (left < right) {
            fragments[left] = fragments[right]
            fragments[right] = null
        }

        left++
        right--
    }
}

fun calcCheckSum(fragments: List<Int?>): Long {
    var index = 0
    var checkSum: Long = 0
    for (fileId in fragments) {
        if (fileId == null) break
        checkSum += index * fileId
        index++
    }
    return checkSum
}

fun moveWholeFileBlock(fragments: MutableList<MutableList<Int?>>) {
    val n = fragments.size
    var fileBlockMoved: Boolean

    do {
        fileBlockMoved = false

        for (fileBlockIndex in n - 1 downTo 0) {
            val files = fragments[fileBlockIndex]
            if (files.isEmpty() || files.last() == null) continue

            var spaceIndex = 0
            while (spaceIndex < n) {
                val spaces = fragments[spaceIndex].filter { it == null }
                if (spaces.size >= files.size) break
                spaceIndex++
            }
            if (spaceIndex > fileBlockIndex) continue;

            val fileFragment = fragments[fileBlockIndex]
            val spaceFragment = fragments[spaceIndex]
            if (fileFragment.size > spaceFragment.size) continue;

            val startIndex = spaceFragment.indexOfFirst { it == null }
            for (fileIndex in files.indices) {
                spaceFragment[startIndex + fileIndex] = files[fileIndex]
            }
            fragments[fileBlockIndex] = MutableList(files.size) { null }

            fileBlockMoved = true
        }
    } while (fileBlockMoved)
}

fun calcFullCheckSum(fragments: List<Int?>): Long {
    var index = 0
    var checkSum: Long = 0
    for (fileId in fragments) {
        checkSum += index * (fileId ?: 0)
        index++
    }
    return checkSum
}

fun part1(input: List<Int>): Long {
    val fragments = createFileSystem(input, true).flatten().toMutableList()
    moveFileLeftmost(fragments)
    return calcCheckSum(fragments)
}

fun part2(input: List<Int>): Long {
    val fragments = createFileSystem(input, false).toMutableList()
    moveWholeFileBlock(fragments)
    return calcFullCheckSum(fragments.flatten())
}


fun main() {
    val input = readInput("Day09")
    val inputTest = readInput("Day09_test")

    println("Part 1: ${part1(input)}") // 1928
    println("Part 1 Test: ${part1(inputTest)}") // 6432869891895

    println("Part 2: ${part2(input)}") // 2858
    println("Part 2 Test: ${part2(inputTest)}") // 6467290479134
}

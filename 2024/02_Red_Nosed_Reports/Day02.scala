// Day 2: Red-Nosed Reports
// https://adventofcode.com/2024/day/2

import scala.io.Source
import scala.util.boundary, boundary.break

object SafeReport {

  def readInput(filename: String): List[String] = {
    Source.fromFile(s"$filename.txt").getLines().toList.filter(_.nonEmpty)
  }

  def isSafeReport(nums: List[Int], allowOneRemove: Boolean = false): Boolean = {
    if (nums.length <= 1) return false

    val MIN_DIFF = 1 
    val MAX_DIFF = 3
    val direction = if (nums(1) - nums(0) > 0) 1 else -1

    def isValidDifference(diff: Int): Boolean = diff >= MIN_DIFF && diff <= MAX_DIFF

    def checkWithRemoval(removedIndex: Int): Boolean = {
      val withoutCurrent = nums.zipWithIndex.collect { case (num, index) if index != removedIndex => num }
      isSafeReport(withoutCurrent, allowOneRemove = false)
    }

    boundary:
      for (i <- 1 until nums.length) {
        val diff = (nums(i) - nums(i - 1)) * direction
        if (!isValidDifference(diff)) {
          if (!allowOneRemove) then break(false)

          // Try removing the current element or one of the previous elements
          val removals = (0 to 2).map(j => i - j).filter(idx => idx >= 0)
          break(removals.exists(checkWithRemoval))
        }
      }
      true
  }

  def prepareInput(input: List[String]): List[List[Int]] = {
    input.map(_.split(" ").map(_.toInt).toList)
  }

  def run(input: List[String], canRemove: Boolean): Int = {
    val data = prepareInput(input)
    data.count(nums => isSafeReport(nums, canRemove))
  }

  def part1(input: List[String]): Int = {
    run(input, canRemove = false)
  }

  def part2(input: List[String]): Int = {
    run(input, canRemove = true)
  }

  def main(args: Array[String]): Unit = {
    val day02 = readInput("Day02")
    val day02Test = readInput("Day02_test")

    println(part1(day02))      // Example output: 2
    println(part1(day02Test))  // Example output: 686

    println(part2(day02))      // Example output: 4
    println(part2(day02Test))  // Example output: 717
  }
}
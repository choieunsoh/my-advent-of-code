import scala.io.Source
import scala.math.abs

object Main {
  
  def readInput(name: String): List[String] = {
    Source.fromFile(s"$name.txt").getLines().toList.map(_.trim)
  }

  def prepareInput(input: List[String]): (List[Int], List[Int]) = {
    val (leftNumbers, rightNumbers) = input.map { line =>
      val parts = line.split("\\s+")
      (parts(0).toInt, parts(1).toInt)
    }.unzip
    (leftNumbers, rightNumbers)
  }

  def part1(input: List[String]): Int = {
    val (leftNumbers, rightNumbers) = prepareInput(input)

    val sortedLeftNumbers = leftNumbers.sorted
    val sortedRightNumbers = rightNumbers.sorted

    val sumOfAbsDiff = sortedLeftNumbers.zip(sortedRightNumbers)
      .map { case (left, right) => abs(left - right) }
      .sum

    sumOfAbsDiff
  }

  def part2(input: List[String]): Int = {
    val (leftNumbers, rightNumbers) = prepareInput(input)

    val frequencyMap = rightNumbers.groupBy(identity).view.mapValues(_.size).toMap
    val similarityScore = leftNumbers
      .map { left => left * frequencyMap.getOrElse(left, 0) }
      .sum

    similarityScore
  }

  def main(args: Array[String]): Unit = {
    // Test if implementation meets criteria from the description
    var testInput = readInput("Day01")
    assert(part1(testInput) == 11)
    assert(part2(testInput) == 31)

    // Or read a large test input from the `src/Day01_test.txt` file
    testInput = readInput("Day01_test")
    assert(part1(testInput) == 1941353)

    // Read the input from the `src/Day01.txt` file
    val input = readInput("Day01_test")
    println(part1(input))
    println(part2(input))
  }
}

// Day 11: Corporate Policy
// https://adventofcode.com/2015/day/11

using System;
using System.Text;
using System.Text.RegularExpressions;

static class Day11
{
    private static readonly Regex ForbiddenPattern = new Regex("[iol]");
    private static readonly Regex DoublePairsPattern = new Regex(@"([a-z])\1.*([a-z])\2");
    private static readonly Regex StraightPattern = new Regex(
        @"abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz"
    );

    private static string IncrementPassword(string str)
    {
        var sb = new StringBuilder(str);
        var i = sb.Length - 1;

        while (i >= 0)
        {
            if (sb[i] == 'z')
            {
                sb[i--] = 'a';
            }
            else
            {
                sb[i] = (char)(sb[i] + 1);
                break;
            }
        }

        return sb.ToString();
    }

    private static bool IsValidPassword(string password) =>
        !ForbiddenPattern.IsMatch(password) &&
        DoublePairsPattern.IsMatch(password) &&
        StraightPattern.IsMatch(password);

    public static string Part1(string input)
    {
        var current = new StringBuilder(input);
        while (!IsValidPassword(current.ToString()))
        {
            current = new StringBuilder(IncrementPassword(current.ToString()));
        }
        return current.ToString();
    }

    public static string Part2(string input) => Part1(IncrementPassword(input));
}

string input = "abcdefgh";
string input2 = "ghijklmn";
string inputTest = "hepxcrrq";

input = Day11.Part1(input);
input2 = Day11.Part1(input2);
inputTest = Day11.Part1(inputTest);

Console.WriteLine($"Part 1: {input}");
Console.WriteLine($"Part 1: {input2}");
Console.WriteLine($"Part 1: {inputTest}");

Console.WriteLine($"Part 2: {Day11.Part2(input)}");
Console.WriteLine($"Part 2: {Day11.Part2(input2)}");
Console.WriteLine($"Part 2: {Day11.Part2(inputTest)}");

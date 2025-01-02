// Day 12: JSAbacusFramework.io
// https://adventofcode.com/2015/day/12

using System;
using System.Text.Json;
using System.Text.RegularExpressions;

public class Day12
{
    private static int SumNumbers(string input)
    {
        return Regex.Matches(input, @"-?\d+")
            .Sum(m => int.Parse(m.Value));
    }

    private static int SumJsonNumbers(JsonElement element, bool skipRed = false)
    {
        return element.ValueKind switch
        {
            JsonValueKind.Number => element.GetInt32(),
            JsonValueKind.Array => element.EnumerateArray().Sum(e => SumJsonNumbers(e, skipRed)),
            JsonValueKind.Object => skipRed && element.EnumerateObject().Any(p => p.Value.ValueKind == JsonValueKind.String && p.Value.GetString() == "red")
                ? 0
                : element.EnumerateObject().Sum(p => SumJsonNumbers(p.Value, skipRed)),
            _ => 0
        };
    }

    public static int Part1(string input) => SumNumbers(input);

    public static int Part2(string input)
    {
        var document = JsonDocument.Parse(input);
        return SumJsonNumbers(document.RootElement, true);
    }
}

var input = System.IO.File.ReadAllText("Day12.txt");
var inputTest = System.IO.File.ReadAllText("Day12_test.txt");

Console.WriteLine($"Part 1: {Day12.Part1(input)}");
Console.WriteLine($"Part 1: {Day12.Part1(inputTest)}");

Console.WriteLine($"Part 2: {Day12.Part2(input)}");
Console.WriteLine($"Part 2: {Day12.Part2(inputTest)}");

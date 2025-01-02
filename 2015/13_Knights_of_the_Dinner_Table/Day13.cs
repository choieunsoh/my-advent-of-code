// Day 13: Knights of the Dinner Table
// https://adventofcode.com/2015/day/13

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

public class Day13
{
    private static List<List<T>> Permutations<T>(List<T> list)
    {
        var result = new List<List<T>>();
        if (list.Count == 0)
        {
            result.Add(new List<T>());
            return result;
        }
        
        for (int i = 0; i < list.Count; i++)
        {
            var current = list[i];
            var remainingList = list.Take(i).Concat(list.Skip(i + 1)).ToList();
            var subPermutations = Permutations(remainingList);
            
            foreach (var subPermutation in subPermutations)
            {
                subPermutation.Insert(0, current);
                result.Add(subPermutation);
            }
        }
        return result;
    }

    private static Dictionary<string, Dictionary<string, int>> PrepareData(string input)
    {
        var map = new Dictionary<string, Dictionary<string, int>>();
        var pattern = @"(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\.";
        
        foreach (var line in input.Split("\r\n"))
        {
            var match = Regex.Match(line, pattern);
            var name = match.Groups[1].Value;
            var next = match.Groups[4].Value;
            var happiness = int.Parse(match.Groups[3].Value);
            if (match.Groups[2].Value == "lose") happiness = -happiness;

            if (!map.ContainsKey(name)) map[name] = new Dictionary<string, int>();
            map[name][next] = happiness;
        }
        return map;
    }

    private static int CalculateHappiness(string input, bool includeMe)
    {
        var map = PrepareData(input);
        var names = map.Keys.ToList();
        var maxHappiness = 0;

        foreach (var arrangement in Permutations(names))
        {
            var happiness = 0;
            var n = arrangement.Count;
            var pairs = includeMe ? n - 1 : n;

            for (int i = 0; i < pairs; i++)
            {
                var current = arrangement[i];
                var next = arrangement[(i + 1) % n];
                happiness += map[current][next] + map[next][current];
            }
            maxHappiness = Math.Max(maxHappiness, happiness);
        }
        return maxHappiness;
    }

    public static int Part1(string input) => CalculateHappiness(input, false);
    public static int Part2(string input) => CalculateHappiness(input, true);
}

var input = File.ReadAllText("Day13.txt");
var inputTest = File.ReadAllText("Day13_test.txt");

Console.WriteLine($"Part 1: {Day13.Part1(input)}");
Console.WriteLine($"Part 1: {Day13.Part1(inputTest)}");
Console.WriteLine($"Part 2: {Day13.Part2(input)}");
Console.WriteLine($"Part 2: {Day13.Part2(inputTest)}");

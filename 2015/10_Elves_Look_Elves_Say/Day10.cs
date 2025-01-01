// Day 10: Elves Look, Elves Say
// https://adventofcode.com/2015/day/10

string LookAndSay(string sequence)
{
    var result = new StringBuilder();
    char currentChar = sequence[0];
    int count = 1;

    for (int i = 1; i <= sequence.Length; i++)
    {
        if (i == sequence.Length || sequence[i] != currentChar)
        {
            result.Append(count).Append(currentChar);
            if (i < sequence.Length)
            {
                currentChar = sequence[i];
                count = 1;
            }
        }
        else
        {
            count++;
        }
    }

    return result.ToString();
}

int GenerateLookAndSaySequence(string input, int iterations)
{
    string sequence = input;
    for (int i = 0; i < iterations; i++)
    {
        sequence = LookAndSay(sequence);
    }

    return sequence.Length;
}

int Part1(string input)
{
    return GenerateLookAndSaySequence(input, 40);
}

int Part2(string input)
{
    return GenerateLookAndSaySequence(input, 50);
}

string input = "1";
string inputTest = "1113222113";

Console.WriteLine("Part 1: " + Part1(input)); // 82350
Console.WriteLine("Part 1: " + Part1(inputTest)); // 252594

Console.WriteLine("Part 2: " + Part2(input)); // 1166642
Console.WriteLine("Part 2: " + Part2(inputTest)); // 3579328

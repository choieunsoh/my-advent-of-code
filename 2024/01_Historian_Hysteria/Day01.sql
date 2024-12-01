WITH input_text AS (
    SELECT '3   4
4   3
2   5
1   3
3   9
3   3' AS text
), data1 AS (
  SELECT regexp_split_to_table(text, '\n') AS line
  FROM input_text
), data2 AS (
	SELECT (STRING_TO_ARRAY(line, '   '))[1]::INTEGER AS left_num
  	,(STRING_TO_ARRAY(line, '   '))[2]::INTEGER AS right_num
	FROM data1
), data3 AS (
  SELECT left_num
  ,ROW_NUMBER() OVER (ORDER BY left_num) AS rank_left
  ,right_num
  ,ROW_NUMBER() OVER (ORDER BY right_num) AS rank_right
  FROM data2
)
SELECT SUM(ABS(A.left_num - B.right_num)) AS sum_of_abs_diff
FROM data3 A
INNER JOIN data3 B
ON A.rank_left = B.rank_right;

WITH input_text AS (
    SELECT '3   4
4   3
2   5
1   3
3   9
3   3' AS text
), data1 AS (
  SELECT regexp_split_to_table(text, '\n') AS line
  FROM input_text
), data2 AS (
	SELECT (STRING_TO_ARRAY(line, '   '))[1]::INTEGER AS left_num
  	,(STRING_TO_ARRAY(line, '   '))[2]::INTEGER AS right_num
	FROM data1
), data3 AS (
  SELECT A.left_num * COUNT(B.right_num) AS score
  FROM data2 A
  INNER JOIN data2 B
  ON A.left_num = B.right_num
  GROUP BY A.left_num
)
SELECT SUM(score) AS similarity_score
FROM data3;

#!/bin/bash

# 测试网站链接
BASE_URL="https://taurusggboy.github.io/openclaw-daily-cn"

echo "测试网站链接..."
echo "基础URL: $BASE_URL"
echo ""

# 测试首页
echo "1. 测试首页:"
curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" "$BASE_URL/"

# 测试文章页面
echo ""
echo "2. 测试文章页面:"
for post in daily-2026-02-01 test welcome; do
    curl -s -o /dev/null -w "%{http_code} $BASE_URL/posts/$post.html\n" "$BASE_URL/posts/$post.html"
done

# 测试sitemap中的URL
echo ""
echo "3. 测试sitemap中的URL:"
curl -s -o /dev/null -w "%{http_code} $BASE_URL/sitemap.xml\n" "$BASE_URL/sitemap.xml"
curl -s -o /dev/null -w "%{http_code} $BASE_URL/sitemap.txt\n" "$BASE_URL/sitemap.txt"

# 测试归档页面（如果有）
echo ""
echo "4. 测试归档页面:"
for year in 2024 2025 2026; do
    curl -s -o /dev/null -w "%{http_code} $BASE_URL/$year/\n" "$BASE_URL/$year/"
done

echo ""
echo "测试完成！"
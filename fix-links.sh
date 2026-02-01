#!/bin/bash

# 修复所有HTML文件中的链接，将根路径/改为/openclaw-daily-cn/
echo "正在修复HTML文件中的链接..."

# 修复index.html
if [ -f "index.html" ]; then
    echo "修复 index.html..."
    sed -i '' 's|href="/"|href="/openclaw-daily-cn/"|g' index.html
    sed -i '' 's|href="/posts/|href="/openclaw-daily-cn/posts/|g' index.html
fi

# 修复posts目录下的所有HTML文件
if [ -d "posts" ]; then
    echo "修复 posts/ 目录下的文件..."
    for file in posts/*.html; do
        if [ -f "$file" ]; then
            echo "修复 $file..."
            sed -i '' 's|href="/"|href="/openclaw-daily-cn/"|g' "$file"
        fi
    done
fi

# 修复其他可能的目录
for dir in archives tags 2024 2025 2026; do
    if [ -d "$dir" ]; then
        echo "检查 $dir/ 目录..."
        find "$dir" -name "*.html" -exec sed -i '' 's|href="/"|href="/openclaw-daily-cn/"|g' {} \;
    fi
done

echo "修复完成！"
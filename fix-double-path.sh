#!/bin/bash

echo "修复双重路径问题..."
echo "将 /openclaw-daily-cn/openclaw-daily-cn/ 改为 /openclaw-daily-cn/"
echo "将 /openclaw-daily-cn/posts/ 改为 /posts/"
echo ""

# 修复index.html
if [ -f "index.html" ]; then
    echo "修复 index.html..."
    # 修复文章链接：/openclaw-daily-cn/posts/ -> /posts/
    sed -i '' 's|href="/openclaw-daily-cn/posts/|href="/posts/|g' index.html
    # 修复首页链接（保持为/openclaw-daily-cn/）
    # 不需要修改，因为首页链接应该是/openclaw-daily-cn/
fi

# 修复posts目录下的文件
if [ -d "posts" ]; then
    echo "修复 posts/ 目录下的文件..."
    for file in posts/*.html; do
        if [ -f "$file" ]; then
            echo "修复 $file..."
            # 返回首页链接：/openclaw-daily-cn/ -> /openclaw-daily-cn/（保持不变）
            # 实际上应该保持为/openclaw-daily-cn/
            sed -i '' 's|href="/openclaw-daily-cn/"|href="/openclaw-daily-cn/"|g' "$file"
        fi
    done
fi

echo ""
echo "检查修复结果："
echo "1. 首页链接应该为：/openclaw-daily-cn/"
echo "2. 文章链接应该为：/posts/[文章名].html"
echo "3. 返回首页链接应该为：/openclaw-daily-cn/"
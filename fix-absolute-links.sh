#!/bin/bash

echo "将相对路径改为绝对路径..."
echo "将 /posts/ 改为 /openclaw-daily-cn/posts/"
echo ""

# 修复index.html中的文章链接
if [ -f "index.html" ]; then
    echo "修复 index.html..."
    # 将相对路径改为绝对路径
    sed -i '' 's|href="/posts/|href="/openclaw-daily-cn/posts/|g' index.html
fi

# 注意：文章页面中的返回首页链接已经是 /openclaw-daily-cn/，不需要修改

echo "修复完成！"
echo "现在文章链接将是绝对路径：/openclaw-daily-cn/posts/[文章名].html"
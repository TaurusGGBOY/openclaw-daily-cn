#!/bin/bash
# OpenClaw Daily CN 自动更新脚本

set -e

echo "🚀 开始更新 OpenClaw Daily CN..."

# 1. 拉取最新 OpenClaw Daily（禁用代理）
echo "📥 拉取 OpenClaw Daily..."
unset https_proxy http_proxy HTTPS_PROXY HTTP_PROXY
curl -sL --max-time 30 https://openclaw.github.io/daily/latest.html -o /tmp/openclaw-daily.html

# 2. 提取内容并保存为文章
echo "📝 提取新闻内容..."
if [ -s /tmp/openclaw-daily.html ]; then
    # 提取 body 内容
    sed -n '/<body>/,/<\/body>/p' /tmp/openclaw-daily.html > source/_posts/openclaw-daily.md
    echo "已保存到 source/_posts/openclaw-daily.md"
fi

# 3. 更新 README
echo "📄 更新 README..."
TODAY=$(date +%Y-%m-%d)
cat > README.md << README
# OpenClaw Daily CN

OpenClaw 项目的每日新闻中文站。

## 更新日期

**${TODAY}**

## 关于

本项目每天自动更新 OpenClaw 项目的最新新闻和动态，并部署到 GitHub Pages。

## 访问

- **GitHub Pages**: https://taurusggboy.github.io/openclaw-daily-cn/
- **源码**: https://github.com/TaurusGGBOY/openclaw-daily-cn

## 自动更新

每天早上 8:00 自动执行更新任务。

## 许可证

MIT
README

# 4. 生成静态文件
echo "🔨 生成静态网站..."
node simple-generate.js

# 5. 提交并部署
echo "📦 提交代码..."
git add -A
git commit -m "Update: ${TODAY}" || echo "无需提交（无变更）"

echo "🚀 推送到 GitHub..."
git push origin main

echo ""
echo "✅ 更新完成！"
echo "🔗 访问地址: https://taurusggboy.github.io/openclaw-daily-cn/"

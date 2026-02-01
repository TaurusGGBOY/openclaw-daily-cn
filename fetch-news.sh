#!/bin/bash
# OpenClaw Daily News Fetcher - 每天抓取新闻并提交到 GitHub Pages

set -e

REPO_DIR=~/project/openclaw-daily-cn  # 使用正确的仓库路径
HTML_DIR="$REPO_DIR/$(date '+%Y/%m')"
HTML_FILE="$HTML_DIR/$(date '+%d').html"
JSON_FILE="$REPO_DIR/news.json"
LOG_FILE="$REPO_DIR/fetch.log"

mkdir -p "$HTML_DIR"

echo "=== $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG_FILE"
echo "抓取 OpenClaw 新闻..." >> "$LOG_FILE"

# 获取新闻
mcporter call minimax.web_search query="OpenClaw Clawdbot 新闻 2026" max_results=15 > "$JSON_FILE" 2>> "$LOG_FILE"

echo "生成 HTML..." >> "$LOG_FILE"

# 生成 HTML
python3 "$REPO_DIR/gen_html.py" "$JSON_FILE" "$HTML_FILE" "$REPO_DIR"

# GitHub 认证
if [ -n "$GITHUB_TOKEN" ]; then
    git config credential.helper store
    git config url."https://$GITHUB_TOKEN@github.com/".insteadOf "https://github.com/"
fi

# 添加文件
git add -A

# 检查是否有变化
if git diff --cached --quiet; then
    echo "没有新内容，跳过提交" >> "$LOG_FILE"
    echo "✅ 今日已有记录，无需重复提交"
else
    # 提交
    git commit -m "📰 $(date '+%Y-%m-%d') OpenClaw 每日新闻" --date="$(date '+%Y-%m-%d %H:%M:%S')"
    
    # 推送到 GitHub (gh-pages 分支用于 GitHub Pages)
    echo "推送到 GitHub..." >> "$LOG_FILE"
    git push origin gh-pages 2>> "$LOG_FILE"
    
    # 获取文件 URL
    FILE_DATE=$(date '+%Y-%m-%d')
    HTML_URL="https://taurusggboy.github.io/openclaw-daily-cn/$(date '+%Y/%m/%d').html"
    
    echo "✅ 已提交: $FILE_DATE"
    echo "✅ HTML: $HTML_URL"
    
    # 发送飞书消息
    echo "发送飞书通知..." >> "$LOG_FILE"
    clawdbot message send \
        --channel feishu \
        --target "ou_e994decd1e92c30ba7e6a653039da537" \
        -m "📰 OpenClaw 每日新闻 ($FILE_DATE)

$HTML_URL

点击查看今日新闻！"
fi

echo "完成!" >> "$LOG_FILE"

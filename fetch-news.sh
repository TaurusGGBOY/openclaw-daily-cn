#!/bin/bash
# OpenClaw Daily News Fetcher

set -e

REPO_DIR=~/openclaw-daily-cn
TODAY=$(date '+%Y-%m-%d')
YEAR=$(date '+%Y')
MONTH=$(date '+%m')
DAY=$(date '+%d')

HTML_DIR="$REPO_DIR/$YEAR/$MONTH"
HTML_FILE="$HTML_DIR/$DAY.html"
JSON_FILE="$REPO_DIR/news.json"
LOG_FILE="$REPO_DIR/fetch.log"

mkdir -p "$HTML_DIR"

echo "=== $TODAY $(date '+%H:%M:%S') ===" >> "$LOG_FILE"
echo "抓取 OpenClaw 新闻..." >> "$LOG_FILE"

# 使用 Minimax web_search 获取新闻
echo "搜索 OpenClaw 相关新闻..." >> "$LOG_FILE"
RESULT=$(mcporter call MiniMax.web_search query="OpenClaw clawdbot AI agent news" 2>/dev/null)

# 保存到 JSON 文件
echo "$RESULT" > "$JSON_FILE"
echo "已保存搜索结果" >> "$LOG_FILE"

# 生成 HTML
python3 "$REPO_DIR/gen_html.py" "$JSON_FILE" "$HTML_FILE" "$REPO_DIR" 2>> "$LOG_FILE"

echo "生成 HTML: $HTML_FILE" >> "$LOG_FILE"

# GitHub 认证
if [ -n "$GITHUB_TOKEN" ]; then
    git config credential.helper store
    git config url."https://$GITHUB_TOKEN@github.com/".insteadOf "https://github.com/"
fi

# 进入仓库目录执行 git
cd "$REPO_DIR"

# 添加文件
git add -A

# 检查是否有变化
if git diff --cached --quiet; then
    echo "没有新内容，跳过提交" >> "$LOG_FILE"
    echo "✅ 今日已有记录，无需重复提交"
else
    # 提交
    git commit -m "📰 $TODAY OpenClaw 每日新闻" --date="$TODAY $(date '+%H:%M:%S')" 2>> "$LOG_FILE"
    
    # 推送
    echo "推送到 GitHub..." >> "$LOG_FILE"
    git push origin gh-pages 2>> "$LOG_FILE"
    
    HTML_URL="https://taurusggboy.github.io/openclaw-daily-cn/$YEAR/$MONTH/$DAY.html"
    
    echo "✅ 已提交: $TODAY"
    echo "✅ HTML: $HTML_URL"
    
    # 发送飞书消息
    echo "发送飞书通知..." >> "$LOG_FILE"
    clawdbot message send \
        --channel feishu \
        --target "ou_e994decd1e92c30ba7e6a653039da537" \
        --message "📰 OpenClaw 每日新闻 ($TODAY)

$HTML_URL

点击查看今日新闻！"
fi

echo "完成!" >> "$LOG_FILE"

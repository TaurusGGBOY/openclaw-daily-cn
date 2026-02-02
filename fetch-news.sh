#!/bin/bash
# OpenClaw Daily News Fetcher - 使用内置 web_fetch 获取新闻

set -e

REPO_DIR=~/project/openclaw-daily-cn
HTML_DIR="$REPO_DIR/posts"
HTML_FILE="$HTML_DIR/daily-$(date '+%Y-%m-%d').html"
JSON_FILE="$REPO_DIR/news.json"
LOG_FILE="$REPO_DIR/fetch.log"
TODAY=$(date '+%Y-%m-%d')

mkdir -p "$HTML_DIR"

echo "=== $TODAY $(date '+%H:%M:%S') ===" >> "$LOG_FILE"
echo "抓取 OpenClaw 新闻..." >> "$LOG_FILE"

# 生成 HTML（使用 clawdbot 代理）
cat > "$HTML_FILE" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw Daily CN - TODAY</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        h1 { color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        .news-item { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .news-item h2 { margin: 0 0 10px 0; color: #0066cc; }
        .news-item a { color: #0066cc; text-decoration: none; }
        .meta { color: #666; font-size: 14px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>📰 OpenClaw 每日新闻 - TODAY</h1>
    
    <div class="news-item">
        <h2>🔔 每日新闻自动更新</h2>
        <div class="meta">TODAY</div>
        <p>OpenClaw 每日中文新闻聚合服务已上线！</p>
        <p><a href="https://taurusggboy.github.io/openclaw-daily-cn/">访问首页</a></p>
    </div>

    <footer style="text-align: center; margin-top: 40px; color: #666;">
        <p>由 <a href="https://github.com/taurusggboy/openclaw-daily-cn">OpenClaw Daily CN</a> 自动生成</p>
        <p>更新时间: TODAY_TIME</p>
    </footer>
</body>
</html>
HTMLEOF

# 替换日期
sed -i "s/TODAY/$TODAY/g" "$HTML_FILE"
sed -i "s/TODAY_TIME/$(date '+%Y-%m-%d %H:%M')/g" "$HTML_FILE"

echo "生成 HTML: $HTML_FILE" >> "$LOG_FILE"

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
    git commit -m "📰 $TODAY OpenClaw 每日新闻" --date="$TODAY $(date '+%H:%M:%S')"
    
    # 推送
    echo "推送到 GitHub..." >> "$LOG_FILE"
    git push origin gh-pages 2>> "$LOG_FILE"
    
    HTML_URL="https://taurusggboy.github.io/openclaw-daily-cn/posts/daily-$TODAY.html"
    
    echo "✅ 已提交: $TODAY"
    echo "✅ HTML: $HTML_URL"
    
    # 发送飞书消息
    echo "发送飞书通知..." >> "$LOG_FILE"
    clawdbot message send \
        --channel feishu \
        --target "ou_e994decd1e92c30ba7e6a653039da537" \
        -m "📰 OpenClaw 每日新闻 ($TODAY)

$HTML_URL

点击查看今日新闻！"
fi

echo "完成!" >> "$LOG_FILE"

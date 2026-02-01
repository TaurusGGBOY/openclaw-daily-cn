#!/usr/bin/env python3
import requests
import time

base_url = "https://taurusggboy.github.io/openclaw-daily-cn"
urls_to_test = [
    "/",
    "/posts/daily-2026-02-01.html",
    "/posts/test.html", 
    "/posts/welcome.html",
    "/sitemap.xml",
    "/sitemap.txt"
]

print("测试网站链接状态...")
print(f"基础URL: {base_url}")
print("-" * 50)

for path in urls_to_test:
    url = base_url + path
    try:
        # 添加时间戳避免缓存
        timestamp = int(time.time())
        if "?" in url:
            test_url = f"{url}&t={timestamp}"
        else:
            test_url = f"{url}?t={timestamp}"
        
        response = requests.get(test_url, timeout=10)
        status = response.status_code
        print(f"{path:30} -> {status}")
        
        # 如果是HTML，检查链接
        if status == 200 and path.endswith(".html"):
            content = response.text[:5000]
            # 检查返回首页链接
            if "返回首页" in content:
                import re
                back_links = re.findall(r'href="([^"]*)"[^>]*>.*返回首页', content)
                if back_links:
                    print(f"  返回首页链接: {back_links[0]}")
            
            # 检查文章链接
            if path == "/":
                article_links = re.findall(r'href="(/openclaw-daily-cn/posts/[^"]*\.html)"', content)
                if article_links:
                    print(f"  找到 {len(article_links)} 个文章链接")
                    
    except requests.exceptions.RequestException as e:
        print(f"{path:30} -> 错误: {e}")
    except Exception as e:
        print(f"{path:30} -> 异常: {e}")

print("-" * 50)
print("测试完成")
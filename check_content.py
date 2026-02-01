#!/usr/bin/env python3
import requests
import time
import re

base_url = "https://taurusggboy.github.io/openclaw-daily-cn"

def check_page(url_path):
    url = base_url + url_path + f"?t={int(time.time())}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            content = response.text
            
            print(f"\n=== 检查 {url_path} ===")
            
            # 检查所有链接
            links = re.findall(r'href="([^"]*)"', content)
            print(f"找到 {len(links)} 个链接:")
            
            for link in links[:20]:  # 只显示前20个
                print(f"  {link}")
                
            # 特别检查返回首页链接
            back_home = re.findall(r'href="([^"]*)"[^>]*>.*返回首页', content)
            if back_home:
                print(f"\n返回首页链接: {back_home[0]}")
                # 测试这个链接
                if back_home[0].startswith("/"):
                    test_url = base_url + back_home[0]
                else:
                    test_url = back_home[0]
                    
                try:
                    r = requests.get(test_url + f"?t={int(time.time())}", timeout=5)
                    print(f"返回首页链接状态: {r.status_code}")
                except:
                    print("返回首页链接测试失败")
                    
            return content
        else:
            print(f"{url_path} -> {response.status_code}")
            return None
            
    except Exception as e:
        print(f"{url_path} -> 错误: {e}")
        return None

# 检查首页
home_content = check_page("/")

# 检查文章页面
if home_content:
    # 从首页提取文章链接
    article_links = re.findall(r'href="(/openclaw-daily-cn/posts/[^"]*\.html)"', home_content)
    if article_links:
        print(f"\n=== 从首页找到 {len(article_links)} 个文章链接 ===")
        for link in article_links[:3]:  # 测试前3个
            # 转换相对路径
            if link.startswith("/openclaw-daily-cn"):
                path = link
            else:
                path = link
            check_page(path)
    else:
        print("首页没有找到文章链接，尝试其他模式...")
        article_links2 = re.findall(r'href="(/posts/[^"]*\.html)"', home_content)
        if article_links2:
            print(f"找到 {len(article_links2)} 个文章链接（旧格式）")
            for link in article_links2[:3]:
                check_page(link)
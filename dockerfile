FROM nginx:alpine

# 將靜態檔案複製到 Nginx 預設目錄
# COPY index.html /usr/share/nginx/html/index.html
COPY . /usr/share/nginx/html/

EXPOSE 80

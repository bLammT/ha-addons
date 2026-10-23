# Wird beim Start aus dieser Vorlage erzeugt (siehe /etc/services.d/nginx/run).
worker_processes 1;
pid /var/run/nginx.pid;
error_log stderr warn;
daemon off;

events {
    worker_connections 256;
}

http {
    access_log off;
    server_tokens off;
    client_max_body_size 20m;

    server {
        listen 8091 ssl;

        ssl_certificate %%CERTFILE%%;
        ssl_certificate_key %%KEYFILE%%;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_session_cache shared:SSL:1m;

        # Jemand ruft den HTTPS-Port mit http:// auf.
        error_page 497 =301 https://$host:$server_port$request_uri;

        location / {
            proxy_pass http://127.0.0.1:8090;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_set_header Connection "";
            # Realtime (u. a. für den Google-Login) nutzt Server-Sent Events.
            proxy_buffering off;
            proxy_read_timeout 360s;
        }
    }
}

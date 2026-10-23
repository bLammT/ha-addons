FROM ghcr.io/home-assistant/base:3.23

ARG BUILD_ARCH
ARG BUILD_VERSION
ARG POCKETBASE_VERSION=0.40.5

RUN apk add --no-cache nginx unzip

# PocketBase von GitHub laden und gegen die offizielle Prüfsumme prüfen.
RUN set -eux; \
    case "${BUILD_ARCH}" in \
        aarch64) pb_arch=arm64; pb_sha=570baa1c45d2fb92fc0073582b945ca0ece03cbf9837ccabf49a222f99dd02e3 ;; \
        amd64) pb_arch=amd64; pb_sha=1dbea1b01eb3dfe64953513859d01e759c96650c4e3264fa4eecd54b769382e4 ;; \
        *) echo "Nicht unterstützte Architektur: ${BUILD_ARCH}"; exit 1 ;; \
    esac; \
    curl -sSLf -o /tmp/pb.zip \
        "https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_${pb_arch}.zip"; \
    echo "${pb_sha}  /tmp/pb.zip" | sha256sum -c -; \
    mkdir -p /opt/pocketbase; \
    unzip -o /tmp/pb.zip pocketbase -d /opt/pocketbase; \
    rm /tmp/pb.zip; \
    chmod a+x /opt/pocketbase/pocketbase

COPY rootfs /
RUN chmod a+x /etc/services.d/*/run /etc/services.d/*/finish

LABEL \
    io.hass.version="${BUILD_VERSION}" \
    io.hass.type="app" \
    io.hass.arch="aarch64|amd64" \
    org.opencontainers.image.title="Reisetagebuch Server" \
    org.opencontainers.image.source="https://github.com/bLammT/ha-addons"

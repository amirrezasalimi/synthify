FROM alpine:latest

ARG PB_VERSION=0.22.8

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    bash

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Copy the local pb_migrations dir into the image
COPY ./pb_migrations /pb/pb_migrations

# Copy the local pb_hooks dir into the image
COPY ./pb_hooks /pb/pb_hooks


# Change directory to /pb where pocketbase executable resides
WORKDIR /pb

# Expose port 8090
EXPOSE 8090

# Start PocketBase
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]

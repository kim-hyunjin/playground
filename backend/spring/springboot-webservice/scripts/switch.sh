#!/usr/bin/env bash

ABSPATH=$(readlink -f $0)
ABSDIR=$(dirname $ABSPATH)
source ${ABSDIR}/profile.sh

function switch_proxy() {
    IDLE_PORT=$(find_idle_port)

    echo "> 전환할 port: $IDLE_PORT"
    echo "> port 전환"
    echo "set \$service_url http://127.0.0.1:${IDLE_PORT};" | sudo tee /etc/nginx/conf.d/service-url.inc # 하나의 문장을 만들어 파이프라인으로 넘겨주기 위해 echo 사용.
    # 엔진엑스가 사용할 프록시 주소 생성 -> service_url.inc에 덮어씀.

    echo "> 엔진엑스 reload"
    sudo service nginx reload
}
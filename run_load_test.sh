#!/usr/bin/env zsh

#
# This script simply executes a provided JavaScript test using
# the local environment established with the `docker-compose`.
# 
# Each execution is provided a unique tag to differentiate
# discrete test runs within the Grafana dashboard.
#

set -e

if [ $# -ne 1 ]; then
    echo "Usage: ./run_load_test.sh <SCRIPT_NAME>"
    exit 1
fi

SCRIPT_NAME=$1
TAG_NAME="$(basename -s .js $SCRIPT_NAME)-$(date +%s)"

echo "--------------------------------------------------------------------------------------"
echo "Staring Prometheus and Grafana"
docker compose up -d prometheus grafana
echo "--------------------------------------------------------------------------------------"
echo "Load testing with Grafana dashboards http://localhost:3000/dashboards"
docker-compose run --rm -T k6 run -<$SCRIPT_NAME --tag testid=$TAG_NAME
echo "--------------------------------------------------------------------------------------"

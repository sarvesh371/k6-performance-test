echo "Stopping the load test"
echo "--------------------------------------------------------------------------------------"
docker rm -f $(docker ps -aqf "name=k6-prometheus-grafana-*")
echo "--------------------------------------------------------------------------------------"
echo "Stopping Grafana and prometheus container"
docker-compose down
echo "--------------------------------------------------------------------------------------"
echo "Cleaning images"
docker rmi -f $(docker images -aq)
docker builder prune -f

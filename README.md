# k6-performance-test

👉 **STAR ⭐ this project for later use and to keep posted on the changes.**

## Table of Contents
- K6
    - [Table of Contents](#table-of-contents)
    - [General Information](#general-information)
    - [Technologies and Techniques](#technologies-and-techniques)
        - [Project configuration](#project-configuration)
        - [Main application](#main-application)
  - [Setup](#setup)

## General Information
- This project was created to learn the basics of k6 and perform load test

## Technologies and Techniques

### Project configuration

<div style="margin-left: 3rem;" >

```
📦src
 ┣ 📂grafana  => Contains grafana dashboards and datasources file.
 ┣ 📂scripts  => Contains k6 load scripts.
 ┗ 📜docker-compose.yml  => Docker compose file to setup grafana, prometheus and k6 on docker.
 ┗ 📜run_load_test.sh  => shell script to run load test.
 ┗ 📜stop_load_test.sh  => shell script to stop load test.

 
``` 
</div>

### Main application
- This project was implemented 100% with k6 and Javascript

## Setup
1. Clone this project by doing:
```
$ git clone https://github.com/sarvesh371/k6-performance-test.git
```
2. Go to the folder you've just cloned the code and execute below command to run a load test:
```
$ sh run_load_test.sh scripts/bdd_load_test.js
```
3. Use below link to open grafana dashboard to view load test results:
```
http://localhost:3000/d/01npcT44k/test-result?orgId=1&refresh=5s&from=now-30m&to=now
```
4. Use below command to stop load test:
```
$ sh stop_load_test.sh
```


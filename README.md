# TIM Dashboard

TIM Dashboard is a Hololens data exploration platform developed at New York University. It can be used to ingest new data or to explore data generated using Hololens. The system can be found at this address: https://dashboard.ptg.poly.edu/

Deployment
==========

The system is currently running at https://dashboard.ptg.poly.edu/. 



Local deployment / development setup
====================================

To deploy the system locally using docker-compose, follow those step:

Build the container
--------------------

```
$ docker-compose build frontend
```

Start the base container
-------------------------

```
$ docker-compose up -d frontend
```

Ports:
* The web interface is at http://localhost:3000

Stop the containers
--------------------

```
$ docker-compose down
```

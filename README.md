# tim-dashboard
TIM Dashboard


Deployment
==========

The system is currently running at https://to-be-defined.org/. 

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

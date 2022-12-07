Local deployment / development setup
=====================================

To deploy the system locally using docker-compose, follow those steps:

Set up the PTG Data Store API
------------------------------------

Access: https://github.com/VIDA-NYU/ptg-api-server

To bring up the server on your local machine, do:

```
$ make services
```

For more information about how to set up the server environment `click here <https://github.com/VIDA-NYU/ptg-api-server#setup-instructions>`_.


Set up Hololens
------------------



Build the containers
---------------------

After bringing up the server and setting up the hololens, build the Dashboard container:

```
$ docker-compose build frontend
```

Start the base container
-------------------------

```
$ docker-compose up -d frontend
```

Ports:

- The web interface is at http://localhost:3000

Stop the containers
--------------------

```
$ docker-compose down
```

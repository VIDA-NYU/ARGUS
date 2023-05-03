Local deployment / development setup
=====================================

To deploy the system locally using docker-compose, follow those steps:

Set up the PTG Data Store API
------------------------------------

Access: https://github.com/VIDA-NYU/ptg-api-server

To bring up the entire server on your local machine, do:

.. code:: bash

  make full

To bring up everything except for the machine learning containers (in case you're using a different machine for GPUs), you can do:

.. code:: bash

  make api
  make dash
  make record

then on the other machine, you would run:

.. code:: bash

  make ml

For more information about how to set up the server environment `click here <https://github.com/VIDA-NYU/ptg-api-server#setup-instructions>`_.


Ports:

- The dashboard is at http://localhost:3000
- The api is at http://localhost:7890
  - for information about how to interact with the API, see:
     - CLI and Python client: https://github.com/VIDA-NYU/ptgctl
     - API Docs: https://api.ptg.poly.edu/docs
- To interact with the mongodb instance, you can use Mongo Express - a GUI for editing documents:
  - Mongo express is available at http://localhost:8081

Set up Hololens
------------------
To setup the Hololens, you need to configure the URL for the API server. Currently to do this, it involves going into the Hololens source code and changing the URL that the Hololens is pointing to. Obviously this is not great.

Perhaps there is a way to have a textbox/dropdown for reconfiguring the URL in the Hololens UI?


Stop the containers
--------------------

.. code:: bash

  make down

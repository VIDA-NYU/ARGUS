[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Documentation Status](https://readthedocs.org/projects/argus-doc/badge/?version=latest)](https://argus-doc.readthedocs.io/en/latest/?badge=latest)

# ARGUS


ARGUS is a visual analytics tool that facilitates multimodal data collection, enables quick user modeling (i.e. modeling of the physical state of the environment and performer behavior), and allows for retrospective analysis and debugging of historical data generated by the AR sensors and ML models that support task guidance. 

ARGUS operates in two main modes: “Online” (during task performance), and “Offline” (after performance). The online mode supports real-time monitoring of model behavior and data acquisition during task execution time. This mode displays tailored visuals of real-time model outputs, which allows users of ARGUS to monitor the system during live sessions and facilitates online debugging. Data is saved incrementally. Once finalized, all data and associated metadata collected during the task is seamlessly stored into a permanent data store with analytical capabilities able to handle both structured data generated by ML models and multimedia data (e.g. video, depth, and audio streams) collected by the headset. 
The system can then be used to explore and analyze historical session data, using the offline mode, by interacting with visualizations that summarize spatiotemporal information as well as highlight detailed information regarding model performance, performer behavior, and the physical environment.

[Documentation is available here](https://argus-doc.readthedocs.io/en/latest/) 

## User interface of ARGUS

![System screen](https://github.com/VIDA-NYU/ARGUS/blob/paper-vis2023/docs/source/screenshots/historical_data_overview.png?raw=true)

## Local deployment / development setup

To deploy the system locally using docker-compose, follow those step:

Note: Please, take into account that ARGUS will be using the NYU's PTG Data Store API. To deploy a local server, please follow the [ARGUS Deployment (for developers)](https://argus-doc.readthedocs.io/en/latest/deployment.html) instructions.

### Build the container

```
$ docker-compose build frontend
```

### Start the base container

```
$ docker-compose up -d frontend
```

Ports:
* The web interface is at http://localhost:3000

### Stop the containers

```
$ docker-compose down
```

## Need Help?
Need help? Open up an [issue](https://github.com/VIDA-NYU/ARGUS/issues).

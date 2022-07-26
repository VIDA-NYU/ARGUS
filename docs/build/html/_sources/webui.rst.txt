Using the web interface
=======================

The web interface allows users to explore the Hololens data with no additional software.

The version of TIM-Dashboard that we host can be accessed at https://dashboard.ptg.poly.edu/

The main TIM-Dashboard functionalities are thought as follows: (1) to record new video recipes, (2) to explore recordings, and (3) to inspect the recipes (ingredients, descriptions, tools, etc).


Create a New Recording 
----------------------

This page allows users to record new videos using a hololens. If the hololens is connected, you will see the live view.\ 

To start a new recording, click on the "Start Recording" button. 

..  figure:: screenshots/start_rec.png

When you are done, click on the "Stop Recording" buttton to stop and finish the recording. Automatically, the video will be saved and uploaded to the server under a unique and pre-generated name with date and time stamps of the current system (YY-MM-DD.HH-MM-SS). 

..  figure:: screenshots/stop_rec.png

To verify if the recording was saved correctly, go to the tab "Historical Data", then click on the last entry from the "Select Data" drop-down. It may take some time to appear here (around 1 min).

..  figure:: screenshots/check_rec.png

Explore
---------

This page allows you to inspect all the recordings. By default, the data that belongs to the first recording is displayed. To select a different recording, use the "Select Data" drop-down menu. 
Currently, the following data is displayed: Cameras (Main, Depth, Grey Left-Left, Grey Left-Front, Grey Right-Front, and Grey Right-Right), Audio, Eye and Hand data.\

Using the controls, users can play/stop all the videos. They can also seek any position on the video using the slider. 

..  figure:: screenshots/historical_data_tab.png

Recipes
---------

This page allows users to explore the recipes. It includes information about the ingredients, tools and descriptions.

..  figure:: screenshots/recipes_tab.png

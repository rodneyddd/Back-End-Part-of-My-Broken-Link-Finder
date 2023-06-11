# Web Scraper 
# Broken Links

## Summary
This project kinda happened today on a wehm, I was on a website and notices alot of the links where broken and wonder if their was a way to search the webpage for all broken links to fix in the funture
**4 HOURS** later we have this project. it is made with node js. In the program i make a call to a website using (request) and save the body info. I wrote a function to parse the body and find all href inside of <a> tags and put them into a list. After the list is made it is passed to antoher funtion to check each one at a time and if any return and error or is over 400 error code it is consider broken the code then list them for the user to see.

<img src = "./back.png" alt = "coding"  width = "100%"> 

## What next

Well the code seems to work so I plan to do the following 
* Make a bunch of edge case to check if the code does indeed work
* Make a website to display the code for people to use 
* Optimize - At the moment with big data it take a while for the code to run i would like to cut down the time vastly

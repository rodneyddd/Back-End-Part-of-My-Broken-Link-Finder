const { link } = require('fs');
const { type } = require('os');
var request = require('request');
var express = require('express');
const bodyParser = require('body-parser');

var app = express()

var options = {
    url:  'http://url',
    timeout: 300000
}

async function checkLinks(data){  

    return new Promise ((res, req) => {
            options.url = data;

            request(options, function(error, response) {
                re = true
                data_tran = []
                try{
                    if(error || response.statusCode > 400){
                        re = false
                    }
                    data_tran = [re, response.statusCode]
                }
                catch(err){
                    re = false;  
                    data_tran = [re, "None"]
                }

                res(data_tran)
            });
           
            
    });    

         
}

function getPage(search){
    return new Promise ((res, req) => {
        request(search, async function (error, response, body) {
        
            if(!(error || response.statusCode > 400)){
                data = response.body
                console.log(data)

                tag = ['<a', '>', 'href="', '"'];
                str = '';
                str2 = ';';
                chk = false;
                links = [];


                for(let i = 0; i < data.length; i++){
                    str += data[i];
                    if(str.substr(str.length-2) == tag[0])  { str = ''; chk = true;}
                    if (str.substr(str.length-1) == tag[1]  && chk){ 
                        chk = false;
                        
                        for(let j = 0; j < str.length; j++){
                            str2 += str[j];
                            if(str2.substr(str2.length-6) == tag[2]){
                                chk = true;
                                str2 = ''
                            }

                            if(str2.substr(str2.length-1) == tag[3] && chk){
                                links.push(str2.substr(0,str2.length-1));
                                chk = false;
                                str2 = ''
                                break;
                            }
                        }            
                        str = ''; 
                    }
                }

                data1 =[]

                for(let i = 0; i < links.length; i++)   
                {
                    if(!(links[i].substr(0,4) != 'http')){
                        data1.push(links[i]);
                    }
                }


                res(data1);
            }
        });
    });
}

async function start(URL){
    counter = 0;
    let response = await getPage(URL);
    console.log("# of links \t", response.length);
    
    data = [];

    await Promise.all(response.map(foo => checkLinks(foo)
        .then((results) => {
            counter += 1;
            if(!(results[0])){
                
                data.push(foo);
                console.log(counter, "\t", results[1], "Bad Link:", foo)
            }
            else {
                console.log(counter, "\t", results[1], "Good Link:", foo)
            }
        })
    ))

    return data 
   
}

app.use('/', function(req, res, next) {
    req.URL = {
        URL: "https://www.google.com"
    }
    res.header("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});

app.use(bodyParser.json())

app.post('/', async (req, res) => {
    console.log( req.body.URL)
    await start(req.body.URL)
    .then(data=> {
        console.log("URLS Found")
        res.send(data)})
    .then(console.log("POST SENT TO REQUESTER"))
})

app.listen(3001)

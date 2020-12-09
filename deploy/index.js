const express = require('express');
const axios = require('axios');

const app = express();

const tiingoKEY = '1e71f73a22514c52b9db4ecaecce49f9591c3170';
const newsKEY = '2e7017b773464037b9fdd634ca5c79ec';
//cors

app.use(express.static(process.cwd()+"/dist/stock-search/"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/dist/stock-search/index.html")
});

//search route
app.get('/api/search/:qtext', (req, res) => {
    //columns can be implemented, with &columns=['ticker', 'name']
    const url = `https://api.tiingo.com/tiingo/utilities/search?query=${req.params.qtext}&
    exactTickerMatch=false&token=${tiingoKEY}`;
    axios.get(url)
    .then(response => {
        data = response.data;
        output = [];
        for(i=0;i<data.length;i++){
            output.push(String(data[i]["ticker"])+" | " + String(data[i]["name"]));
        }
        res.json(output);       
    });
});

//stock detail
app.get('/api/detail/:ticker', (req, res) => {
    const url1 = `https://api.tiingo.com/tiingo/daily/${req.params.ticker}?token=${tiingoKEY}`;
    const url2 =  `https://api.tiingo.com/iex/?tickers=${req.params.ticker}&token=${tiingoKEY}`;
    
    const requestOne = axios.get(url1);
    const requestTwo = axios.get(url2);
    // https://www.storyblok.com/tp/how-to-send-multiple-requests-using-axios
    axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        const dataOne = responseOne.data;
        const dataTwo = responseTwo.data;

        var output = {};
        var mStatus;
        output["ticker"] = dataOne["ticker"];
        output["name"] = dataOne["name"];
        output["eCode"] = dataOne["exchangeCode"];
        output["last"] = dataTwo[0]["last"];
        output["change"] = (parseFloat(dataTwo[0]["last"]) - parseFloat(dataTwo[0]["prevClose"])).toFixed(2);
        output["changePercent"] = ((output["change"]/ parseFloat(dataTwo[0]["prevClose"])) * 100).toFixed(2) ;
        var currentdate = new Date(); 
        function addZero(i) {
            if (i < 10) {
              i = "0" + i;
            }
            return i;
          }
        var currdate = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + addZero(currentdate.getHours()) + ":"  
                + addZero(currentdate.getMinutes()) + ":" 
                + addZero(currentdate.getSeconds());
        output["currentTime"] = currdate;
        var lastdate = new Date(dataTwo[0]["timestamp"]);
        
        // var lastparse = new Date(dataTwo[0]["timestamp"]);
        // console.log(lastdate);
        // console.log(currentdate);
        var ldate = lastdate.getFullYear() + "-"
                + (lastdate.getMonth()+1)  + "-" 
                + lastdate.getDate() + " " +addZero(lastdate.getHours()) + ":"  
                + addZero(lastdate.getMinutes()) + ":" 
                + addZero(lastdate.getSeconds());
        
                var ldate2 = lastdate.getFullYear() + "-"
                + (lastdate.getMonth()+1)  + "-" 
                + lastdate.getDate();
        // console.log(Date.parse(lastdate));
        // console.log(Date.parse(currentdate));
        if(Date.parse(currentdate)-Date.parse(lastdate) < 60000){
            mStatus = "open";
        }
        else{
            mStatus = "closed";
        }
        output["mStatus"] = mStatus;
        output["lastTime"] = ldate;
        output["description"] = dataOne["description"];
        output["startDate"] = dataOne["startDate"];
        output["ldate"] = ldate2;
        
        
        
        // console.log(output);
        res.send(output);
      })).catch(errors => {
        // res.send(error["message"]);
      });
    
});

//stock summary
app.get('/api/summary/:ticker', (req, res) => {
    const url = `https://api.tiingo.com/iex/?tickers=${req.params.ticker}&token=${tiingoKEY}`;
    axios.get(url)
    .then(response => {
            data = response.data;
            var currentdate = new Date(); ;
            var lastdate = new Date(data[0]["timestamp"]);
            var mStatus;
            var output = {};
            var ldate = lastdate.getFullYear() + "-"
                + (lastdate.getMonth()+1)  + "-" 
                + lastdate.getDate();
            if(Date.parse(currentdate)-Date.parse(lastdate) < 60000){
                mStatus = "open";
            }
            else{
                mStatus = "closed";
            }
            console.log(lastdate);
            if(mStatus == "open"){
                output["high"] = data[0]["high"];
                output["low"] = data[0]["low"];
                output["open"] = data[0]["open"];
                output["close"] = data[0]["close"];
                output["volume"] = data[0]["volume"];
                output["mid"] = data[0]["mid"];
                output["askPrice"] = data[0]["askPrice"];
                output["askSize"] = data[0]["askSize"];
                output["bidPrice"] = data[0]["bidPrice"];
                output["bidSize"] = data[0]["bidSize"];
                output['lastdate'] = ldate.toString();
            }
            else {
                output["high"] = data[0]["high"];
                output["low"] = data[0]["low"];
                output["open"] = data[0]["open"];
                output["close"] = data[0]["prevClose"];
                output["volume"] = data[0]["volume"];
                output['lastdate'] = ldate.toString();
                // console.log(output);
            }
            res.send(output);
    });
            
});

//news API
app.get('/api/news/:ticker', (req, res) => {
    const url = `https://newsapi.org/v2/everything?q=${req.params.ticker}&apiKey=${newsKEY}`;

    axios.get(url)
    .then(response => {
        var output = [];
        data = response.data;
        // console.log(data["articles"].length);
        for(i=0; i<data["articles"].length; i++){
            temp = {};
            if(data["articles"][i]["urlToImage"] != null && data["articles"][i]["urlToImage"] != ""){
                temp["url"] = data["articles"][i]["url"];
                temp["title"] = data["articles"][i]["title"];
                temp["description"] = data["articles"][i]["description"];
                temp["source"] = data["articles"][i]["source"]["name"];
                temp["urlToImage"] = data["articles"][i]["urlToImage"];
                temp["publishedAt"] = new Date(data["articles"][i]["publishedAt"]).toDateString().substring(4,);
                output.push(temp);
            }
        }
        console.log(output);
        res.json(output);
    });
});

//hist
app.get('/api/hist/:ticker/:start', (req, res) => {
    let url = `https://api.tiingo.com/tiingo/daily/${req.params.ticker}/prices?resampleFreq=daily&startDate=${req.params.start}&token=${tiingoKEY}`;
    // console.log(url);
    axios.get(url)
    .catch(error => console.log("error"))
    .then(response => {
        output = [];
        data = response.data;
        for(var i=0; i<data.length;i++){
            output[i] = data[i];
        }
        res.send(output);
    });
});

//charts
app.get('/api/charts/:ticker/:start', (req, res) => {
    let url = `https://api.tiingo.com/iex/${req.params.ticker}/prices?startDate=${req.params.start}&resampleFreq=4min&token=${tiingoKEY}`;
    // console.log(url);
    axios.get(url)
    .catch(error => console.log("error"))
    .then(response => {
        output = [];
        data = response.data;
        for(var i=0;i<data.length;i++){
            d= new Date(data[i]['date']);
            console.log(d);
            console.log(d.toLocaleString('en-US', {timezone: 'America/Los_Angeles'}));
            output.push([Date.parse(d.toLocaleString('en-US', {timezone: 'America/Los_Angeles'})), data[i]['close']]);
        }
        
        res.json(output);
    });
});

//test
app.get('/api/test/:ticker', (req,res) => {
    let url = `https://api.tiingo.com/tiingo/daily/${req.params.ticker}?token=${tiingoKEY}`;
    axios.get(url)
    .catch(error => res.send(error))
    .then(response => {
        data = response.data;
        if('detail' in data){
            res.send("error");
        }
        else{
            res.send("success");
        }
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.....`));   
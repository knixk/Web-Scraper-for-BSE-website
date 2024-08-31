const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express")
const pretty = require("pretty");
const app = express();

const url = `https://www.bseindia.com/corporates/shpPromoterNGroup.aspx?scripcd=500325&qtrid=116.00&QtrName=December%202022`;

axios(url)
    .then(res => {
        const html = res.data;
        const $ = cheerio.load(html)
        // code here 
        const articles = [];
        const elemSelector = '#tdData > table > tbody > tr:nth-child(3) > td > table > tbody > tr';
        
        const keys = [
            'category_of_stakeholders',
            'entity_type',
            'no_of_shareholders',
            'no_of_fully_paid_up_equity_shares_held',
            'no_of_partly_paid-up_equity_shares_held',
            'no_of_shares_underlying_Depository_Receipts',
            'Total_no_shares_held',
            'Shareholding_as_a_%_of_total_no_of_shares',
            'Number_of_Voting_Rights_held_in_each_class_of_securities_X',
            'Number_of_Voting_Rights_held_in_each_class_of_securities_Total',
            'Number_of_equity_shares_held_in_dematerialized_form',

        ]

        $(elemSelector, html).each((parentIdx, parentElem) => {
            const bse_data = {}

            let keyIdx = 0;
            $(parentElem).children().each((childIdx, childElem) => {
                const tdValue = $(childElem).text() 
                bse_data[keys[keyIdx]] = tdValue;
                keyIdx++;
            })
            articles.push(bse_data)
        })

        articles.shift();
        articles.shift();
        articles.shift();
        articles.shift();

        console.log(articles[articles.length - 1])
    }).catch(err => {
        console.log(err)
    })

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
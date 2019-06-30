# web-shopcart
This project made by nodejs and vuejs.
To start it, you need install mongodb first and then inject data to mongodb

## import database
First, go to server/database directory and open your terminal
```
mongoimport -d db_demo -c users --file
```
Then drag the dumail-goods to your terminal and you will see something like this
```
mongoimport -d db_demo -c users --file F:\old\nodejs\web-shopcart\server\database\dumall-goods
```
use the same way import dumall-users to mongodb and check if db_demo exsits in mongo terminal


## Start Server
```
cd server
yarn install
node app.js
```

## Start client
In root direcotry
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

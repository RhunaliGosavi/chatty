#! /bin/bash
# sed -i "s/CHATTY_REPLACE_WITH_SERVER_URL_HERE/http:\/\/$BOT_URL:8082/g" src/constants.js
npm run build
# sed -i "s/http:\/\/$BOT_URL:8082/CHATTY_REPLACE_WITH_SERVER_URL_HERE/g" src/constants.js

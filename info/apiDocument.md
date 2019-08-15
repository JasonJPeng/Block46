get:  /api/coins   all coins available with id, img, name, symbol
get:  /api/coins/:id/price  coin market price NOW
get:  /api/coins/:id/history?from=fromDate&to=nowDate coin historical price
post: /api/coins/:id/history add (up to date) coin historical price
get: /api/coins/:id/news   get latest news for the coin 
get: /api/coins/:id/info   get coin information

post: /api/users     create a new user account
put:  /api/users/:id  add coins to a user




post: /api/admin/coins  create a collection for all coins with id, name, symbol, logo  
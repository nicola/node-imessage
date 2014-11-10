# node-imessage

Binds iMessage to NodeJS (read-only)

#### ATTENTION: only available to brave coders, heavy development going on.

## Install

```
npm install imessage --save
```

## Usage


```javascript
var iMessage = require('imessage');

var im = new iMessage();
im
  .getAll()
  .keyword(["love", "happy"], ["sad", "hate"])
  .from(["+1231231231", "+89898989898"])
  .limit(10)
  .exec(function(err, rows) {
    console.log(rows);
  })
```

### Use raw SQL queries

```javascript
var iMessage = require('imessage');

var im = new iMessage();
im.getDb(function(err, db) {
  db.get("SELECT * FROM `messages`");
})
```
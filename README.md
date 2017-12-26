# node-imessage
[![Build Status][imessage-downloads-image]][imessage-downloads-url]

Binds iMessage to NodeJS (read-only)

##### ATTENTION: only available to brave coders, heavy development going on.

[Discuss on HN](https://news.ycombinator.com/item?id=8589152) or star the project to be updated.

## Install

```
npm install imessage --save
```

To use the command line tool

```
npm install -g imessage
```

## Usage

### Command line

```
Usage: imessagejs <command>

command     
  search         Search messages with particular text
  recipients     Search messages with particular recipient
```

#### Search

```
Usage: imessagejs search "text to search" [options]

Options:
   --count       Just return the count
   --recipient   ID of the recipient
   --json        Print in json format
   --path    iMessage path to the chat.db

```

#### Recipients

```
Usage: imessagejs recipients ["recipient name to filter"] [options]

Options:
   --count   Just return the count
   --json    Print in json format
   --path    iMessage path to the chat.db
```

### NodeJS Library

#### Recipients

```javascript
var iMessage = require('imessage');
var im = new iMessage();

// Get all recipients
im.getRecipients(cb)

// Get recipients with "nicola"
im.getRecipients("nicola", cb)

// Get recipient Id
im.getRecipientById(1, cb)
// Get recipient and all of his messages
im.getRecipientById(1, true, cb)
```

#### Messages

```javascript
// Get all messages
im.getMessages(cb)

// Get messages with text
im.getMessages("hello you", cb);

// Get messages from recipient Id
im.getMessagesFromId(1, cb)
// Get messages from recipient with specific text
im.getMessagesFromId(1, "with text", cb)
```

#### Attachments

```javascript
// Get all attachments
im.getAttachments(cb)

// Get attachements from recipient Id
im.getAttachmentsFromId(1, cb)
```

### Use raw SQL queries

```javascript
var iMessage = require('imessage');

var im = new iMessage();
im.getDb(function(err, db) {
  db.get("SELECT * FROM `messages`");
})
```

### Ideally

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

## Examples

- [Express implementation](https://github.com/nicola/node-imessage/tree/master/examples/express-imessage)
- [Gist - Find all links sent through iMessage](https://gist.github.com/nicola/309787e78ee0d7bedeec)

[imessage-downloads-image]: https://img.shields.io/npm/dm/imessage.svg?style=flat
[imessage-downloads-url]: https://npmjs.org/package/imessage

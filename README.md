Command line Textalk Webshop API Client
=======================================
Do calls to TWAPI from your commandline!


Install
-------
```
npm install -g twapi-cli
```

Usage
-----

```
Usage: twapi-cli -w <webshop> [-a <auth>] [-l <lang>] [-u <api-url>] [--stage] <method> [<param1> <param2> ...]
       twapi-cli -w <webshop> [-a <auth>] [-l <lang>] [-u <api-url>] [--stage] theme-update <theme-id> <patch>
       twapi-cli -w <webshop> [-a <auth>] [-l <lang>] [-u <api-url>] [--stage] theme-set-js <theme-id> <file>
```


**twapi-cli** can do three things at the moment, generic calls, updating and patching of Theme API
blobb and uploading of script as custom javascript.

#### Options


|  Options       |                             |
|:--------------|:----------------------------|
| `-w <webshop>` | Sets webshop context, defaults to 22222 |
| `-a <auth>`    |  Auth key to use           |
| `-l <lang>`    | Language code for context  |
| `-u <api-url>` | TwApi url, defaults to production |
| `--stage`      | Shorthand for changing Api url to stage |

#### Doing a call
```
# Defaults to webshop 22222
twapi-cli Theme.select true

# JSON arguments needs ''
twapi-cli Theme.select '{ "uid": true, "name": true }'
```

#### Updating a Theme with a patch
```
twapi-cli -w 32208 theme-update 3857 '{"name": "Foo"}'
```

#### Settings Theme settings.custom_javascript.script to contents of a file
```
twapi-cli -w 32208 theme-set-js 3857 pwned.js
```

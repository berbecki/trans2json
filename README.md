TRANS2JSON
======

Use trans2json it if you want to transfer translations from CSV fo JSON files.
From one CSV file you will receive as many translation files as you declare in
CSV.

Preferred target NGX-translate.

## Install

npm i trans2json

npm i -g trans2json

---

The header of your CSV file must contain at least one prefix (which will be
a token) and a translation list. The default number of prefixes is 3.

## For example:
  component,specificator,token,en,de,fr

All prefixes will be joined into the final translation token:
  component,specificator,token,en,de,fr
  app,headers,page_header,Main Page,Hauptseite,Page principale
    =>
  en.json "app::headers::page_header": "Main Page"
  de.json "app::headers::page_header": "Hauptseite"
  fr.json "app::headers::page_header": "Page principale"


## Options:
  -h, --help       Show help                                           [boolean]
  -v, --version    Show version number                                 [boolean]
  -i, --input      Declare input path for your CSV translation file   [required]
  -o, --output     Declare output path                                [required]
  -s, --separator  Separator in CSV file                 [string] [default: ","]
  -j, --joiner     Token joiner                         [string] [default: "::"]
  -p, --prefixes   How many prefixes would you use         [number] [default: 3]
  -c, --clear      Clear terminal viewport            [boolean] [default: false]
  -d, --data       Show output data                   [boolean] [default: false]

## Examples:
  trans2json --help                         Show this message
  trans2json --version                      Print out the installed version of
                                            $0
  trans2json -i /translation.csv -o         To make translations
  /static/i18n

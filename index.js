#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const os = require('os')

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

const yargs = require('yargs')
    .usage(
        `Use $0 it if you want to transfer translations from CSV fo JSON files. 
From one CSV file you will receive as many translation files as you declare in CSV. The header of your CSV file must contain at least one prefix (which will be a token) and a translation list. The default number of prefixes is 3.

For example:
  component,specificator,token,en,de,fr

All prefixes will be joined into the final translation token:
  component,specificator,token,en,de,fr
  app,headers,page_header,Main Page,Hauptseite,Page principale
    =>
  en.json "app::headers::page_header": "Main Page"
  de.json "app::headers::page_header": "Hauptseite"
  fr.json "app::headers::page_header": "Page principale"
`
    )
    .example([
        ['$0 --help', 'Show this message'],
        ['$0 --version', 'Print out the installed version of $0'],
        ['$0 -i /translation.csv -o /static/i18n', 'To make translations'],
    ])
    .epilog('Copyright (C) 2020 Jacek Berbecki')
    .help('help')
    .alias('help', 'h')
    .version('version', 'Version: v1.0.0')
    .alias('version', 'v')
    .options({
        input: {
            alias: 'i',
            description: 'Declare input path for your CSV translation file',
            requiresArg: true,
            require: true,
        },
        output: {
            alias: 'o',
            description: 'Declare output path',
            requiresArg: true,
            require: true,
        },
        separator: {
            alias: 's',
            description: 'Separator in CSV file',
            default: ',',
            type: 'string',
            requiresArg: false,
            require: false,
        },
        joiner: {
            alias: 'j',
            description: 'Token\'s joiner',
            default: '::',
            type: 'string',
            requiresArg: false,
            require: false,
        },
        prefixes: {
            alias: 'p',
            description: 'How many prefixes would you use',
            default: 3,
            type: 'number',
            requiresArg: false,
        },
        clear: {
            alias: 'c',
            description: 'Clear terminal viewport',
            requiresArg: false,
            require: false,
            type: 'boolean',
            default: false,
        },
        data: {
            alias: 'd',
            description: 'Show output data',
            requiresArg: false,
            require: false,
            type: 'boolean',
            default: false,
        },
    })

const {
    clear: clearPrompt,
    data,
    input,
    output,
    separator,
    prefixes,
    joiner,
} = yargs.argv

if (clearPrompt) clear()

console.log(
    chalk.yellow(figlet.textSync('CSV to JSON', { horizontalLayout: 'full' }))
)

const getFilesData = (cb) => {
    let lines = ''
    try {
        lines = fs.readFileSync(input, 'utf8')
    } catch (err) {
        console.log(
            chalk.red(
                ' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            )
        )
        switch (err.code) {
            case 'ENOENT':
                console.log(chalk.red(' No such file or directory: ' + input))
                break
            case 'EACCES':
                console.log(chalk.red(' Permission denied: ' + input))
                break
            default:
                throw err
        }
        console.log(
            chalk.red(
                ' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            )
        )
        return lines
    }
    return lines
}

const lines = getFilesData().split(os.EOL)

const saveFile = (lang, data) => {
    if (data) {
        console.log(`${lang}.json`)
        console.log(data)
    }
    const destPath = path.join(output, `${lang}.json`)
    fs.writeFileSync(
        destPath,
        JSON.stringify(data, null, 2),
        {
            encoding: 'utf8',
        }
    )
}

const makeObject = (data, langs) => {
    const keys = data.map((elem) =>
        elem.slice(0, parseInt(prefixes, 10)).join(joiner)
    )
    langs.forEach((lang, i) => {
        const ooo = {}
        const perLang = data.map((elem) => elem[i + parseInt(prefixes, 10)])
        keys.forEach((el, j) => {
            ooo[el] = perLang[j]
        })
        saveFile(lang, ooo)
    })
}

if (lines.length > 1) {
    const langs = lines[0].split(',').slice(parseInt(prefixes, 10))
    const data = lines.slice(1)
    const normalizedData = data.map((elem) => {
        return elem.split(',')
    })
    makeObject(normalizedData, langs)
}

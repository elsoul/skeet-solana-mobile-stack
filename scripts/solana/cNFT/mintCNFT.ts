import dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'

console.log(process.env.WALLET_FILE)
console.log(fs.readFileSync(process.env.WALLET_FILE as string, 'utf-8'))

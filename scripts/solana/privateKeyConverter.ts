import * as bs58 from 'bs58'
import * as fs from 'fs'
import * as readlineSync from 'readline-sync'

// コマンドライン引数からファイル名を取得（デフォルトは "key.json"）
const fileName = process.argv[2] || 'key.json'

// マスクされた入力を取得
const input = readlineSync.question(
  'Please enter the string displayed in Phantom\'s "Show Private Key": ',
  {
    hideEchoBack: true,
  }
)

const decoded = bs58.decode(input)
const uintArray = new Uint8Array(
  decoded.buffer,
  decoded.byteOffset,
  decoded.byteLength / Uint8Array.BYTES_PER_ELEMENT
)

fs.writeFileSync(fileName, `[${uintArray}]`)
console.log(`\nThe private key has been saved to ${fileName}.`)

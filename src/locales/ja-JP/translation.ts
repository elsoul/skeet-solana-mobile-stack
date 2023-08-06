import defaultJA from './default'
import openAiChat from './openAiChat'
import routes from './routes'
import settings from './settings'
import users from './users'
import solana from './solana'

const translationJA = {
  translation: {
    ...defaultJA,
    openAiChat,
    routes,
    settings,
    solana,
    users,
  },
}

export default translationJA

import { atom } from 'recoil'

export type UserState = {
  uid: string
  email: string
  username: string
  iconUrl: string
}

export const defaultUser = {
  uid: '',
  email: '',
  username: '',
  iconUrl: '',
}

export const userState = atom<UserState>({
  key: 'userState',
  default: defaultUser,
})

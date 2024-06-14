import {ID, Response} from '@/_metronic/helpers'
export type User = {
  id?: ID
  name?: string
  avatar?: string
  email?: string
  position?: string
  role?: string
  last_login?: string
  two_steps?: boolean
  enable?: boolean
  joined_day?: string
  online?: boolean
  initials?: {
    label: string
    state: string
  }
}

export type Products = {
  id?: ID
  code?: string
  available?: boolean
  name?: string
  style?: string
  series?: string
  supplier?: string
  color?: string
  color_scheme?: string
  material?: string
  design?: string
  block?: number
  absorption?: number
  description?: string
  created_time?: string
  enable?: boolean
}

export type Series = {
  id?: ID
  code?: string
  enable?: boolean
  name?: string
  comments?: string
}

export type ColorScheme = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type Design = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type Material = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type Supplier = {
  id?: ID
  code: string
  enable?: boolean
  name?: string
  comments?: string
}

export type Account = {
  id?: ID
  enable?: boolean
  role?: string
  code?: string
  avatar?: string
  name?: string
  id_code?: string
  phone_number?: string
  email?: string
  password?: string
}

export type Role = {
  id?: ID
  name?: string
  list?: Array<string>
  comments?: string
  auth?: any
}

export type Environment = {
  id?: ID
  name?: string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  position: 'Art Director',
  role: 'Administrator',
  name: '',
  email: '',
}

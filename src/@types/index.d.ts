/* eslint-disable no-var */
declare namespace NodeJS {
  export interface Global {
    root: string
  }
}
// eslint-disable-next-line vars-on-top
declare var root: string

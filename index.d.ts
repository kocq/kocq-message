/// <reference types="node" />
import * as kocq from 'koa-oicq'

export interface Config {
  /**
   * 是否开启异步模式
   */
  sync?: boolean
}

export type MidFunction = (ctx: kocq.MessageContext, next?: Promise<any>) => void;
export interface MidConstructor {
  install(add: (mid: MidFunction) => void): void
}

export class KocqMessage {

  constructor(conf: Config)

  use(middleware: MidFunction): this
  use(middleware: MidConstructor): this

  callback(): kocq.MidFunction
  install(add: (mid: kocq.MidFunction) => void): void

}

export = KocqMessage

import { Context, Schema } from 'koishi'

export const name = 'chatlog'
export const inject = ["database"]

export interface Config {
  show_in_log: boolean
  save_to_db: boolean
}

export const Config: Schema<Config> = Schema.object({
  show_in_log: Schema.boolean().description("是否在日志中显示？").default(true),
  save_to_db: Schema.boolean().description("是否存储在数据库中？").default(true)
})

declare module 'koishi' {
  interface Tables {
    chatlog: ChatlogDB
  }
}

interface ChatlogDB {
  id?: number,
  timestamp: number,
  platform: string,
  type: string,
  selfId: string,
  userId: string,
  messageId: string,
  channelId: string,
  message: string,
}


export function apply(ctx: Context, config: Config) {
  ctx.model.extend('chatlog', {
    id: {
      type: 'unsigned',
    },
    timestamp: 'unsigned',
    platform: 'string(63)',
    type: 'string(63)',
    selfId: 'string(63)',
    userId: 'string(63)',
    messageId: 'string',
    channelId: 'string',
    message: 'text',
  }, {
    primary: 'id',
    autoInc: true,
  })
  const dispose = ctx.middleware(
    async (session, next) => {
      if (config.show_in_log) {
        ctx.logger.info(`[${session.username}@${session.channelId}] '${JSON.parse(JSON.stringify(session.content))}'`)
        ctx.logger.debug(JSON.parse(JSON.stringify(session)))
      }
      if (config.save_to_db) {
        const log: ChatlogDB = {
          timestamp: session.timestamp,
          platform: session.platform,
          type: session.type,
          selfId: session.selfId,
          userId: session.userId,
          messageId: session.messageId,
          channelId: session.channelId,
          message: JSON.stringify(session.content),
        }
        await ctx.database.create('chatlog', log)
      }
      return next()
    }, true
  )
}

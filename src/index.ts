import { Context, Schema } from 'koishi'

export const name = 'chatlog'
export const inject = ["database"]

export interface Config {
  enable: boolean
}

export const Config: Schema<Config> = Schema.object({
  enable: Schema.boolean().description("是否启用？")
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
  message: string,
  user: string,
  channel: string,
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
    message: 'text',
    user: 'string(255)',
    channel: 'string(255)'
  }, {
    primary: 'id',
    autoInc: true,
  })
  const dispose = ctx.middleware(
    async (session, next) => {
      if (config.enable) {
        ctx.logger.info(`[${session.username}] '${JSON.parse(JSON.stringify(session.content))}'`)
        const log: ChatlogDB = {
          timestamp: session.timestamp,
          platform: session.platform,
          type: session.type,
          selfId: session.selfId,
          userId: session.userId,
          message: JSON.stringify(session.content),
          user: JSON.stringify(session?.user),
          channel: JSON.stringify(session?.channel)
        }
        await ctx.database.create('chatlog', log)
      }
      return next()
    }, true
  )
}

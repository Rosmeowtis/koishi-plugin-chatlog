# koishi-plugin-chatlog

[![npm](https://img.shields.io/npm/v/koishi-plugin-chatlog?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-chatlog)

将Bot接受到的信息以简略形式显示在日志中（Info级别），并将主要的session内容存储在数据库中。

在设置中可以分别启用日志记录或数据库记录功能。但无论是否启用数据库保存功能，插件总会在数据库中创建 `chatlog` 表，请注意数据库中是否已有同名表格。

```yml
  chatlog:
    show_in_log: true # 是否将消息记录显示在日志中
    save_to_db: true # 是否将消息记录保存在数据库中
```

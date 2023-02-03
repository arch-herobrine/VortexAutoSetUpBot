const { Client, GatewayIntentBits } = require("discord.js"), dotenv = require("dotenv")
dotenv.config()

const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
dayjs().format()



process.on('uncaughtException', function (err) {
    console.log(err)
});

//java.lang.NullPointerExceptionをぬるぽと呼ぶスレ
//>>1
//　ぬるぽ
//>>2
//　　Λ＿Λ　　＼＼
//　 （　・∀・）　　　|　|　ｶﾞｯ
//　と　　　　）　 　 |　|
//　　 Ｙ　/ノ　　　 人
//　　　 /　）　 　 < 　>_Λ∩
//　 ＿/し'　／／. Ｖ｀Д´）/←>>1
//　（＿フ彡　　　　　 　　/　

var ga = `\`\`\`
　　Λ＿Λ　　＼＼
　 （　・∀・）　　　|　|　ｶﾞｯ
　と　　　　）　 　 |　|
　　 Ｙ　/ノ　　　 人
　　　 /　）　 　 < 　>_Λ∩
　 ＿/し'　／／. Ｖ｀Д´）/←you
　（＿フ彡　　　　　 　　/　
\`\`\``

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

client.token = process.env.token



//絵文字s
var emojis = {}


//無能関数s
function array2Collection(messages) {
    return new Collection(messages.slice().sort((a, b) => BigInt(b.id) - BigInt(a.id)).map(e => [e.id, e]));
}
const { Collection } = require("@discordjs/collection");
async function fetchMany(channel, options = { limit: 50 }) {
    if ((options.limit ?? 50) <= 100) {
        return channel.messages.fetch(options);
    }

    if (typeof options.around === "string") {
        const messages = await channel.messages.fetch({ ...options, limit: 100 });
        const limit = Math.floor((options.limit - 100) / 2);
        if (messages.size < 100) {
            return messages;
        }
        const backward = fetchMany(channel, { limit, before: messages.last().id });
        const forward = fetchMany(channel, { limit, after: messages.first().id });
        return array2Collection([messages, ...await Promise.all([backward, forward])].flatMap(
            e => [...e.values()]
        ));
    }
    let temp;
    function buildParameter() {
        const req_cnt = Math.min(options.limit - messages.length, 100);
        if (typeof options.after === "string") {
            const after = temp
                ? temp.first().id : options.after
            return { ...options, limit: req_cnt, after };
        }
        const before = temp
            ? temp.last().id : options.before;
        return { ...options, limit: req_cnt, before };
    }
    const messages = [];
    while (messages.length < options.limit) {
        const param = buildParameter();
        temp = await channel.messages.fetch(param);
        messages.push(...temp.values());
        if (param.limit > temp.size) {
            break;
        }
    }
    return array2Collection(messages);
}




//commands
client.on("messageCreate", async (msg) => {
    if (msg.author.bot) {
        if (msg.content == "このチャンネルのNukeに成功しました") {
            msg.reply("いつからNuke成功したと錯覚していた?(負け惜しみ)")
        }
        return
    }
    if (msg.content == "あ") {
        msg.reply("あ゛ぁ゛？")
    } else if (msg.content == "arch!ping") {
        msg.reply(`ws:${client.ws.ping}ms\nAPI:${Date.now() - msg.createdTimestamp}ms`)
    } else if (msg.content == "こんにちは") {
        msg.reply("とっとと帰れ")
    } else if (msg.content == "負けました" || msg.content == "勝ちました") {
        msg.reply("https://tenor.com/view/aori-gif-18276293")
    } else if (msg.content.split(" ")[0] == "arch!nukemsg") {
        if (msg.member.permissions.has("ManageMessages")) {
            if (parseInt(msg.content.split(" ")[1], 10)) {
                try {
                    var aa = await fetchMany(msg.channel, { before: msg.id, limit: parseInt(msg.content.split(" ")[1], 10) })
                    aa.forEach((msg) => { msg.delete() })
                    msg.reply(`${parseInt(msg.content.split(" ")[1], 10)}のメッセージをNuke中(たまに時間かかるよ!)`)
                }
                catch (e) {
                    msg.reply("Fatal Error()")
                }
            } else {
                msg.reply("有効な値を(ry")
            }
        } else {
            msg.reply({ content: "お前に権限ねーから！", files: ["お前の席ねーから.png"] })
        }
    } else if (msg.content == "🤔") {
        msg.reply("https://media.discordapp.net/attachments/1010062867388698667/1061159934600945664/thinking.gif")
    } else if (msg.content == "ぬるぽ") {
        msg.reply(ga)
    } else if (msg.content == "かそ" || msg.content == "過疎") {
        msg.reply("過疎")
    } else if (msg.content == "arch!help") {
        msg.reply({
            "embeds": [
                {
                    "title": "コマンド一覧",
                    "description": "順次追加予定",
                    "color": 3998965,
                    "timestamp": "2023-01-30T23:06:06.853Z",
                    "footer": {
                        "text": "created by arch-herobrine#3053"
                    },
                    "fields": [
                        {
                            "name": "arch!help",
                            "value": "これ"
                        }, {
                            "name": "arch!nukemsg <メッセージ数(数字)>",
                            "value": "メッセ管理権限ないと使えないやつ。Vortexの`>>clear`の劣化版。101以上を指定するとバグる"
                        }, {
                            "name": "arch!ping",
                            "value": "ping"
                        }, {
                            "name": "arch!timeout <対象のメンバーのid> <時間(秒数指定)>",
                            "value": "要タイムアウト権限。監査ログには実行者のタグが入る。"
                        }, {
                            "name": "arch!untimeout <対象のメンバーのid>",
                            "value": "要タイムアウト権限。こっちも監査ログには実行者のタグが入る。"
                        }, {
                            "name": "arch!kick <対象のメンバーのid>",
                            "value": "要キック権限。こっちも監査ログには実行者のタグが入る。"
                        }, {
                            "name": "arch!ban <対象のメンバーのid>",
                            "value": "要BAN権限。こっちも監査ログには実行者のタグが入る。"
                        }, {
                            "name": "arch!unban <対象のユーザーのid>",
                            "value": "要BAN権限。こっちも監査ログには実行者のタグが入る。"
                        }
                    ]
                }
            ]
        })
    } else if (msg.content == "hello") {
        msg.channel.awaitMessages({ filter: () => true, max: 1, time: 10000 })
            .then(collected => {
                if (!collected.size) {
                    msg.reply({ files: ["butNobodyCame.png"] })
                } else {
                    return
                }
            })
    } else if (msg.content.split(" ")[0] == "arch!timeout") {
        if (msg.member.permissions.has("ModerateMembers")) {
            if (parseInt(msg.content.split(" ")[2], 10)) {
                try {
                    if ((await msg.guild.members.fetch(msg.content.split(" ")[1]))) {
                        (await msg.guild.members.fetch(msg.content.split(" ")[1])).timeout(parseInt(msg.content.split(" ")[2], 10) * 1000, `${msg.author.tag}が実行しやがりました`).then(() => {
                            msg.reply(`${client.users.cache.get(msg.content.split(" ")[1]).tag}をタイムアウトしたンゴ`)
                        })
                    } else {
                        msg.reply("Fatal Error()")
                    }
                }
                catch (e) {
                    console.log(e)
                    msg.reply("Fatal Error()")
                }
            } else {
                msg.reply("有効な値を(ry")
            }
        } else {
            msg.reply({ content: "お前に権限ねーから！", files: ["お前の席ねーから.png"] })
        }
    } else if (msg.content.split(" ")[0] == "arch!untimeout") {
        if (msg.member.permissions.has("ModerateMembers")) {

            try {
                if ((await msg.guild.members.fetch(msg.content.split(" ")[1]))) {
                    (await msg.guild.members.fetch(msg.content.split(" ")[1])).timeout(null, `${msg.author.tag}が実行しやがりました`).then(() => {
                        msg.reply(`${client.users.cache.get(msg.content.split(" ")[1]).tag}のタイムアウト解除したンゴ`)
                    })
                } else {
                    msg.reply("Fatal Error()")
                }
            }
            catch (e) {
                console.log(e)
                msg.reply("Fatal Error()")
            }
        } else {
            msg.reply({ content: "お前に権限ねーから！", files: ["お前の席ねーから.png"] })
        }
    } else if (msg.content.split(" ")[0] == "arch!kick") {
        if (msg.member.permissions.has("KickMembers")) {
            if ((await msg.guild.members.fetch(msg.content.split(" ")[1])).kickable) {
                try {
                    if ((await msg.guild.members.fetch(msg.content.split(" ")[1]))) {
                        (await msg.guild.members.fetch(msg.content.split(" ")[1])).kick(`${msg.author.tag}が実行しやがりました`).then(() => {
                            msg.reply(`${client.users.cache.get(msg.content.split(" ")[1]).tag}をこの鯖から蹴っときますた`)
                        })
                    } else {
                        msg.reply("Fatal Error()")
                    }
                }
                catch (e) {
                    console.log(e)
                    msg.reply("Fatal Error()")
                }
            } else {
                msg.reply("俺に権原が足りないンゴ...()")
            }
        } else {
            msg.reply({ content: "お前に権限ねーから！", files: ["お前の席ねーから.png"] })
        }
    } else if (msg.content.split(" ")[0] == "arch!ban") {
        if (msg.member.permissions.has("BanMembers")) {
            if ((await msg.guild.members.fetch(msg.content.split(" ")[1])).bannable) {
                try {
                    if ((await msg.guild.members.fetch(msg.content.split(" ")[1]))) {
                        (await msg.guild.members.fetch(msg.content.split(" ")[1])).ban(`${msg.author.tag}が実行しやがりました`).then(() => {
                            msg.reply(`${client.users.cache.get(msg.content.split(" ")[1]).tag}をこの鯖からBANしときますた`)
                        })
                    } else {
                        msg.reply("Fatal Error()")
                    }
                }
                catch (e) {
                    console.log(e)
                    msg.reply("Fatal Error()")
                }
            } else {
                msg.reply("俺に権原が足りないンゴ...()")
            }
        } else {
            msg.reply({ content: "お前に権限ねーから！", files: ["お前の席ねーから.png"] })
        }
    } else if (msg.content.split(" ")[0] == "arch!unban") {
        if (msg.member.permissions.has("BanMembers")) {
            if ((await client.users.fetch(msg.content.split(" ")[1]))) {
                try {
                    if ((await client.users.fetch(msg.content.split(" ")[1]))) {
                        msg.guild.members.unban(msg.content.split(" ")[1])
                        msg.reply(`${client.users.cache.get(msg.content.split(" ")[1]).tag}のBAN解除しときますた`)

                    } else {
                        msg.reply("Fatal Error()")
                    }
                }
                catch (e) {
                    console.log(e)
                    msg.reply("Fatal Error()")
                }
            } else {
                msg.reply("俺に権原が足りないンゴ...()")
            }
        } else {
            msg.reply({ content: "お前に権限ねーから！", files: ["お前の席ねーから.png"] })
        }
    }
})




//共栄圏専用
client.on("channelCreate", async (ch) => {
    if (ch.name == "🇰🇵┃荒ʖ‘し人民元") {
        ch.send("ミュートロールセットアップ開始")
        var chs = JSON.parse(JSON.stringify(ch.guild))
        await chs.channels.forEach(function (i) {
            var a = client.channels.cache.get(i)
            if (a.type == "GuildCategory") {
                (async () => {
                    await a.permissionOverwrites.set([
                        {
                            id: '1070580833360027668',
                            allow: [],
                            deny: ['ADD_REACTIONS', "SEND_MESSAGES", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS", "CONNECT", "SPEAK"],
                            type: "role"
                        }
                    ], '全自動MuteRoleSetUp');
                })()
            } else if (a.type == "GuildVoice") {
                (async () => {
                    await a.permissionOverwrites.set([
                        {
                            id: '1070580833360027668',
                            allow: [],
                            deny: ['ADD_REACTIONS', "SEND_MESSAGES", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS", "CONNECT", "SPEAK"],
                            type: "role"
                        }
                    ], '全自動MuteRoleSetUp');
                })()
            } else if (a.type == "GuildStageVoice") {
                (async () => {
                    await a.permissionOverwrites.set([
                        {
                            id: '1070580833360027668',
                            allow: [],
                            deny: ["CONNECT"],
                            type: "role"
                        }
                    ], '全自動MuteRoleSetUp');
                })()
            } else if (a.type == "GuildText") {
                (async () => {
                    await a.permissionOverwrites.set([
                        {
                            id: '1070580833360027668',
                            allow: [],
                            deny: ['ADD_REACTIONS', "SEND_MESSAGES", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"],
                            type: "role"
                        }
                    ], '全自動MuteRoleSetUp');
                })()
            }
        })
        ch.send("ミュートロールセットアップ完了")
    }
}
)

client.on("ready", () => {
    emojis.check = client.emojis.resolve("1070948763616673862")
    
})
client.login()

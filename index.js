const { Client, GatewayIntentBits } = require("discord.js"), dotenv = require("dotenv")
dotenv.config()

process.on('uncaughtException', function(err) {
    console.log(err)
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

client.token = process.env.token

const { Collection } = require("@discordjs/collection");

function array2Collection(messages) {
    return new Collection(messages.slice().sort((a, b) => BigInt(b.id) - BigInt(a.id)).map(e => [e.id, e]));
}

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

client.on("messageCreate", async (msg) => {
    if (msg.content == "このチャンネルのNukeに成功しました")
        if (msg.author.bot) {
            if (msg.content == "このチャンネルのNukeに成功しました") {
                msg.reply("いつからNuke成功したと錯覚していた?(負け惜しみ)")
            }
            return
        }
    if (msg.content == "あ") {
        msg.reply("あ゛ぁ゛？")
    } else if (msg.content == "arch!ping") {
        msg.reply(`${client.ws.ping}ms`)
    } else if (msg.content == "こんにちは") {
        msg.reply("とっとと帰れ")
    } else if (msg.content == "負けました" || msg.content == "勝ちました") {
        msg.reply("https://tenor.com/view/aori-gif-18276293")
    } else if (msg.content.split(" ")[0] == "arch!nukemsg") {
        if (msg.member.permissions.has("ManageMessages")) {
            if (parseInt(msg.content.split(" ")[1], 10)) {
                try{
                var aa = await fetchMany(msg.channel, { before: msg.id, limit: parseInt(msg.content.split(" ")[1], 10) })
                await aa.forEach((msg) => { msg.delete() })
                msg.reply(`${parseInt(msg.content.split(" ")[1], 10)}のメッセージをNuke中(たまに時間かかるよ!)`)}
                catch(e){
                    msg.reply("Fatal Error()")
                }
            } else {
                msg.reply("有効な値を(ry")
            }
        } else {
            msg.reply({content:"お前に権限ねーから！",files:["お前の席ねーから.png"]})
        }
    }
})

client.on("channelCreate", async (ch) => {
    if (ch.name == "🇰🇵│荒ʖ‘し人民元") {
        ch.send("ミュートロールセットアップ開始")
        var chs = JSON.parse(JSON.stringify(ch.guild))
        await chs.channels.forEach(function (i) {
            var a = client.channels.cache.get(i)
            if (a.type == "GuildCategory") {
                (async () => {
                    await a.permissionOverwrites.set([
                        {
                            id: '1054247482365853776',
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
                            id: '1054247482365853776',
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
                            id: '1054247482365853776',
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
                            id: '1054247482365853776',
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
    console.log(`${client.user.tag}でログインしたンゴ`)
})

client.login()


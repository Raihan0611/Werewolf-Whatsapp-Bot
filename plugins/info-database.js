let handler = async (m) => {
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let untotalreg = Object.values(global.db.data.users).filter(user => user.registered == false).length
    m.reply(`
   ┌──>
   │List Jumlah User
   │ *TotalUser:* ${totalreg}
   │ *Register:* ${untotalreg}
   │ *UserAktif:* ${rtotalreg}
   └───>
`)
}
handler.help = ['database', 'user']
handler.tags = ['info']
handler.command = /^(database|jumlahdatabase|user)$/i

export default handler

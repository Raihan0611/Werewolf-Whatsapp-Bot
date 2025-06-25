const handler = async (m, { conn, usedPrefix, text }) => {
    const groupId = m.chat;
    const teks = m.quoted && m.quoted.text ? m.quoted.text : text;
    
    const groupMetadata = await conn.groupMetadata(groupId);
    const participants = groupMetadata?.participants || [];
    
    const mentions = participants.map(participant => participant.id);
    
    conn.sendMessage(
      groupId,
      {
        text: text ? `@${groupId} ${text}` : `@${groupId}`,
        contextInfo: {
          mentionedJid: mentions,
          groupMentions: [{ groupSubject: "Everyone", groupJid: groupId }]
        }
      }
    );
  }

handler.help = ['tagall <message>']
handler.tags = ['group']
handler.command = /^(tagall|all)$/i
handler.group = true
handler.admin = true

export default handler
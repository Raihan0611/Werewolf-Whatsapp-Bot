let handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, {
        poll: {
            name: 'Silakan pilih:',
            values: ['a', 'b'],
            selectableCount: 1
        }
    })
}

handler.onPollUpdate = async (m, { conn }) => {
    if (!m.pollUpdates) return;
    const pollUpdate = m.pollUpdates[0];
    if (!pollUpdate) return;

    // DEBUG: cek apakah fungsi ini terpanggil dan struktur pollUpdate
    console.log('[POLL DEBUG]', JSON.stringify(pollUpdate, null, 2));

    // Cek voters, votersByOption, selectedOptions, option
    let selectedIdx;
    if (pollUpdate.voters && pollUpdate.voters[0]?.selectedOptions?.length) {
        selectedIdx = pollUpdate.voters[0].selectedOptions[0];
    } else if (pollUpdate.votersByOption && Array.isArray(pollUpdate.votersByOption)) {
        // Cari index yang ada voternya
        selectedIdx = pollUpdate.votersByOption.findIndex(arr => arr && arr.length > 0);
    } else if (Array.isArray(pollUpdate.selectedOptions) && pollUpdate.selectedOptions.length) {
        selectedIdx = pollUpdate.selectedOptions[0];
    } else if (typeof pollUpdate.option === 'number') {
        selectedIdx = pollUpdate.option;
    } else if (pollUpdate.voters && typeof pollUpdate.voters[0]?.option === 'number') {
        selectedIdx = pollUpdate.voters[0].option;
    }

    let values = pollUpdate.values || (pollUpdate.pollCreationMessage && pollUpdate.pollCreationMessage.values);
    if (typeof selectedIdx !== 'number' || !values) return;
    const selected = values[selectedIdx];
    if (!selected) return;
    await conn.sendMessage(m.chat, { text: selected });
}

handler.help = ['poll']
handler.tags = ['utility']
handler.command = /^\.poll$/i

export default handler
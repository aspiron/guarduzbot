'use strict';

const { managesGroup, removeGroup } = require('../../stores/group');

const leaveCommandHandler = async ctx => {
	const { chat, message, telegram, state, replyWithHTML } = ctx;
	const { isMaster } = state;
	if (!isMaster) return null;

	const groupName = message.text.split(' ').slice(1).join(' ');

	if (groupName) {
		const group = /^-?\d+/.test(groupName)
			? { id: Number(groupName) }
			:	{ title: groupName };
		const isGroup = await managesGroup(group);
		if (!isGroup) {
			// eslint-disable-next-line function-paren-newline
			return replyWithHTML(
				'ℹ️ <b>Ushbu nom/id bilan guruh topolmadim.</b>'
			// eslint-disable-next-line function-paren-newline
			);
		}
		await Promise.all([
			removeGroup(isGroup),
			telegram.leaveChat(isGroup.id)
		]);
		return replyWithHTML('✅ <b>U guruhni men boshqarmayabman.</b>');
	}

	await removeGroup(chat);
	return telegram.leaveChat(chat.id);
};

module.exports = leaveCommandHandler;

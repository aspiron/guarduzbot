'use strict';

// DB
const { getCommand, removeCommand } = require('../../stores/command');

// Bot
const { replyOptions } = require('../../bot/options');

const removeCommandHandler = async ({ chat, message, reply, state }) => {
	const { isAdmin, isMaster } = state;
	const { text } = message;
	if (chat.type !== 'private') return null;

	if (!isAdmin) {
		return reply(
			'ℹ️ <b>Uzr, bu buyruqqa faqat adminlargina haqli.</b>',
			replyOptions
		);
	}
	const [ , commandName ] = text.split(' ');
	if (!commandName) {
		return reply(
			'<b>To`g`ri buyruq jo`nating.</b>\n\nMisol uchun:\n' +
			'<code>/removeCommand rules</code>',
			replyOptions
		);
	}

	const command = await getCommand({ name: commandName.toLowerCase() });
	if (!command) {
		return reply(
			'ℹ️ <b>Buyruq topilmadi.</b>',
			replyOptions
		);
	}

	const role = command.role.toLowerCase();
	if (role === 'master' && !isMaster) {
		return reply(
			'ℹ️ <b>Uzr, faqat mastergina buyruqni o`chiroladi.</b>',
			replyOptions
		);
	}

	await removeCommand({ name: commandName.toLowerCase() });
	return reply(
		`✅ <code>!${commandName}</code> ` +
		'<b>muvaffaqiyatli o`chirildi.</b>',
		replyOptions
	);
};

module.exports = removeCommandHandler;

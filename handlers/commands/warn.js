'use strict';

// Utils
const { scheduleDeletion } = require('../../utils/tg');

// Bot
const { replyOptions } = require('../../bot/options');

// DB
const { isAdmin } = require('../../stores/user');

const warnHandler = async (ctx) => {
	const { message, reply, me } = ctx;
	const userToWarn = message.reply_to_message
		? Object.assign({ username: '' }, message.reply_to_message.from)
		: message.commandMention
			? Object.assign({ username: '' }, message.commandMention)
			: null;

	if (ctx.from.status !== 'admin') return null;

	if (message.chat.type === 'private') {
		return reply(
			'ℹ️ <b>Buyruq guruhlardagina ishlaydi.</b>',
			replyOptions
		);
	}


	if (!userToWarn) {
		return reply(
			'ℹ️ <b>User xabariga javob qaytaring yoki uni xabarda eslating.</b>',
			replyOptions
		).then(scheduleDeletion);
	}

	if (userToWarn.username.toLowerCase() === me.toLowerCase()) return null;

	const reason = message.text.split(' ').slice(1).join(' ').trim();

	if (await isAdmin(userToWarn)) {
		return reply('ℹ️ <b>Boshqa adminlarni ogohlantira olmaysiz.</b>', replyOptions);
	}

	if (reason.length === 0) {
		return reply('ℹ️ <b>Ogohlantirish uchun sabab.</b>', replyOptions)
			.then(scheduleDeletion);
	}

	if (message.reply_to_message) {
		ctx.deleteMessage(message.reply_to_message.message_id);
	}

	return ctx.warn({ admin: ctx.from, reason, userToWarn });
};

module.exports = warnHandler;

'use strict';

const { Markup } = require('telegraf');
const { last } = require('ramda');

// Bot
const { replyOptions } = require('../../bot/options');

// DB
const {
	getCommand,
	removeCommand,
	updateCommand
} = require('../../stores/command');

const createNewCommand = ctx => {
	const { message } = ctx;
	const { caption, text, photo } = message;
	const [ type ] = ctx.updateSubTypes;

	if (text) {
		return { content: text, type: 'text' };
	}
	if (photo) {
		return {
			caption,
			content: last(photo).file_id,
			type: 'photo',
		};
	}
	return { caption, content: message[type].file_id, type };
};

const addCustomCmdHandler = async (ctx, next) => {
	const { chat, message, reply, from } = ctx;
	const { text } = message;
	const { id } = from;
	const isAdmin = from.status === 'admin';

	if (text && /^\/\w+/.test(text)) {
		await removeCommand({ id, isActive: false });
		return next();
	}

	const command = await getCommand({ id, isActive: false });
	if (chat.type !== 'private' ||
		!isAdmin ||
		!command ||
		!command.state) {
		return next();
	}

	if (command.state === 'role') {
		const role = text.toLowerCase();
		if (role !== 'master' && role !== 'admins' && role !== 'everyone') {
			reply('Please send a valid role.', Markup.keyboard([
				[ 'Master', 'Admins', 'Everyone' ]
			])
				.oneTime()
				.resize()
				.extra());
			return next();
		}
		await updateCommand({ id, role, state: 'content' });
		return reply(
			'Command yuborilganda ko`rsatmoqchi bo`lgan narsani yuboring.' +
			'.\n\nSupported contents:\n- <b>Text (HTML)</b>\n- <b>Photo</b>' +
			'\n- <b>Video</b>\n- <b>Dokument</b>\n- <b>Audio</b>',
			replyOptions
		);
	}

	if (command.state === 'content') {
		const newCommand = createNewCommand(ctx);

		await updateCommand({ ...newCommand, id, isActive: true, state: null });
		return reply(
			'✅ <b>Yangi buyruq muvaffaqiyatli yaratildi.</b>\n\n' +
			'Ushbu turdagi buyruqlar / ning o`rniga ! bilan ishlaydi .\n\n' +
			'Misol uchun: <code>!rules</code>\n\n' +
			'/commands - buyruqlar ro`yxatini ko`rish uchun.\n' +
			'/addcommand - yangi buyruq qo`shish uchun.\n' +
			'/removecomand <code>&lt;name&gt;</code> - buyruqni o`chirish uchun.',
			replyOptions
		);
	}
	return next();
};

module.exports = addCustomCmdHandler;

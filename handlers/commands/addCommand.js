'use strict';

// DB
const { addCommand, getCommand } = require('../../stores/command');

// Bot
const { Markup } = require('telegraf');
const { replyOptions } = require('../../bot/options');

const { isMaster } = require('../../utils/config');

const preserved = require('../commands').handlers;

const addCommandHandler = async (ctx) => {
	const { chat, message, reply } = ctx;
	const { id } = ctx.from;
	if (chat.type !== 'private') return null;

	if (ctx.from.status !== 'admin') {
		return reply(
			'ℹ️ <b>Uzr, bu buyruqqa faqat adminlargina haqli.</b>',
			replyOptions
		);
	}

	const [ slashCommand, commandName = '' ] = message.text.split(' ');
	const isValidName = /^!?(\w+)$/.exec(commandName);
	if (!isValidName) {
		return reply(
			'<b>To`g`ri buyruq jo`nating.</b>\n\nMisol uchun:\n' +
			'<code>/addcommand rules</code>',
			replyOptions
		);
	}
	const newCommand = isValidName[1].toLowerCase();
	if (preserved.has(newCommand)) {
		return reply('❗️ Bu nom saqlanganlar ro`yxatida mavjud.\n\n' +
			'Boshqasini yozib ko`ring.');
	}

	const replaceCmd = slashCommand.toLowerCase() === '/replacecommand';

	const cmdExists = await getCommand({ isActive: true, name: newCommand });

	if (!replaceCmd && cmdExists) {
		return ctx.replyWithHTML(
			'ℹ️ <b>Bu buyruq allaqachon mavjud.</b>\n\n' +
			'/commands - buyruqlar ro`yxatini ko`rish uchun.\n' +
			'/addcommand - yangi buyruq qo`shish uchun.\n' +
			'/removecomand <code>&lt;name&gt;</code> - buyruqni o`chirish uchun.',
			Markup.keyboard([ [ `/replaceCommand ${newCommand}` ] ])
				.oneTime()
				.resize()
				.extra()
		);
	}
	if (cmdExists && cmdExists.role === 'master' && !isMaster(ctx.from)) {
		return ctx.reply(
			'ℹ️ <b>Sorry, only master can replace this command.</b>',
			replyOptions
		);
	}
	await addCommand({ id, name: newCommand, state: 'role' });
	return reply('Who can use this command?', Markup.keyboard([
		[ 'Master', 'Admins', 'Everyone' ]
	])
		.oneTime()
		.resize()
		.extra());
};

module.exports = addCommandHandler;

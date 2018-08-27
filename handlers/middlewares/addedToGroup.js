'use strict';

// Bot
const { replyOptions } = require('../../bot/options');

const { admin } = require('../../stores/user');
const { addGroup } = require('../../stores/group');
const { isMaster } = require('../../utils/config');

const addedToGroupHandler = async (ctx, next) => {
	const msg = ctx.message;

	const wasAdded = msg.new_chat_members.some(user =>
		user.username === ctx.me);
	if (wasAdded && isMaster(ctx.from)) {
		await admin(ctx.from);
		const link = ctx.chat.username
			? `https://t.me/${ctx.chat.username.toLowerCase()}`
			: await ctx.exportChatInviteLink().catch(() => '');
		if (!link) {
			// eslint-disable-next-line function-paren-newline
			await ctx.replyWithHTML(
				'⚠️ <b>Chatning linkini olishda muvaffaqiyatsizlik.</b>\n' +
				'Guruh /groups listida ko`rinmaydi.\n' +
				'\n' +
				'Agar siz ko`rsatishni xohlasangiz , ' +
				'menga admin huquqini bering, ' +
				'va /showgroup buyrug`ini bering.');
		}
		const { id, title, type } = ctx.chat;
		await addGroup({ id, link, title, type });
		ctx.reply(
			'🛠 <b>Ok, hozirdan boshlab ushbu guruhni boshqarishga yordam beraman.</b>',
			replyOptions
		);
	}

	return next();
};

module.exports = addedToGroupHandler;

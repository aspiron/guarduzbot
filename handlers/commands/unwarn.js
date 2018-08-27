'use strict';

const { last } = require('ramda');

// Utils
const { link, scheduleDeletion } = require('../../utils/tg');

// Config
const { numberOfWarnsToBan } = require('../../config');

// Bot
const { replyOptions } = require('../../bot/options');

// DB
const { listGroups } = require('../../stores/group');
const { getUser, unwarn } = require('../../stores/user');

const noop = Function.prototype;

const unwarnHandler = async ({ message, reply, state, telegram }) => {
	const { isAdmin, user } = state;
	if (!isAdmin) return null;

	const userToUnwarn = message.reply_to_message
		? message.reply_to_message.from
		: message.commandMention
			? message.commandMention
			: null;

	if (!userToUnwarn) {
		return reply(
			'ℹ️ <b>User xabariga javob qaytaring yoki uni xabarda eslating.</b>',
			replyOptions
		).then(scheduleDeletion);
	}

	const dbUser = await getUser({ id: userToUnwarn.id });

	const allWarns = dbUser.warns;

	if (allWarns.length === 0) {
		return reply(
			`ℹ️ ${link(userToUnwarn)} <b> ogohlantirishlari yo'q.</b>`,
			replyOptions
		);
	}

	if (dbUser.status === 'banned') {
		const groups = await listGroups();

		groups.forEach(group =>
			telegram.unbanChatMember(group.id, userToUnwarn.id));
	}

	await unwarn(userToUnwarn);

	if (dbUser.status === 'banned') {
		telegram.sendMessage(
			userToUnwarn.id,
			'♻️ /groups dagi barcha guruhlardan baningiz olib tashlandi!'
		).catch(noop);
		// it's likely that the banned person haven't PMed the bot,
		// which will cause the sendMessage to fail,
		// hance .catch(noop)
		// (it's an expected, non-critical failure)
	}

	const lastWarn = last(allWarns);

	return reply(
		`❎ ${link(user)} <b>adminimiz</b> ${link(userToUnwarn)}ni ` +
		`<b>quyidagi uchun kechirdi:</b>\n\n${lastWarn.reason || lastWarn}` +
		` (${allWarns.length - 1}/${numberOfWarnsToBan})`,
		replyOptions
	);
};


module.exports = unwarnHandler;

'use strict';

// Utils
const { link, scheduleDeletion } = require('../../utils/tg');
const { logError } = require('../../utils/log');

// Bot
const { replyOptions } = require('../../bot/options');

// DB
const { listGroups } = require('../../stores/group');
const { isBanned, unban } = require('../../stores/user');

const noop = Function.prototype;

const unbanHandler = async ({ message, reply, telegram, state }) => {
	const { isAdmin, user } = state;
	if (!isAdmin) return null;

	const userToUnban = message.reply_to_message
		? message.reply_to_message.from
		: message.commandMention
			? message.commandMention
			: null;

	if (!userToUnban) {
		return reply(
			'ℹ️ <b>User xabariga javob qaytaring yoki uni xabarda eslating.</b>',
			replyOptions
		).then(scheduleDeletion);
	}


	if (!await isBanned(userToUnban)) {
		return reply('ℹ️ <b>User banlanmagan.</b>', replyOptions);
	}

	const groups = await listGroups();

	const unbans = groups.map(group =>
		telegram.unbanChatMember(group.id, userToUnban.id));

	try {
		await Promise.all(unbans);
	} catch (err) {
		logError(err);
	}

	try {
		await unban(userToUnban);
	} catch (err) {
		logError(err);
	}

	telegram.sendMessage(
		userToUnban.id,
		'♻️ /groups dagi barcha guruhlardan baningiz olib tashlangan!'
	).catch(noop);
	// it's likely that the banned person haven't PMed the bot,
	// which will cause the sendMessage to fail,
	// hance .catch(noop)
	// (it's an expected, non-critical failure)

	if (userToUnban.first_name === '') {
		return reply(`♻️ ${link(user)} <b><code>${userToUnban.id}</code> ushbu idagi` +
		`userning bani olib tashlandi</b>.`, replyOptions);
	}


	return reply(`♻️ ${link(user)} <b>admin</b> ` +
		`${link(userToUnban)}ni <b>bandan ozod qildi</b>.`, replyOptions);
};

module.exports = unbanHandler;

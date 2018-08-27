'use strict';

const getLongCodeBlocks = msg =>
	(msg.entities || [])
		.filter(entity => entity.type == 'pre')
		.filter(({ offset, length }) => msg.text
			.slice(offset, offset + length)
			.split(/\n/g)
			.length > 10
		);

function *reversed(arr) {
	for (let i = arr.length - 1; i >= 0; i--) {
		yield arr[i];
	}
}

const replace = (s, from, length, replacement) =>
	s.slice(0, from) + replacement + s.slice(from + length);

const withoutCodeBlocks = ({ text, entities = [] }) => {
	for (const { type, offset, length } of reversed(entities)) {
		if (type === 'pre' || type === 'code') {
			text = replace(text, offset, length, '\n');
		}
	}
	return text;
}

const createHandler = ({ replyToPm }) => ({ message, chat, reply }, next) => {
	if (!message) {
		return next();
	}

	const { text } = message;
	const replyOptions = { reply_to_message_id: message.message_id };

	if (!['group', 'supergroup'].includes(chat.type)) {
		if (!replyToPm) {
			return next();
		}
		return reply(
			"Hello! Put me in a group, and I'll " +
			"point out when people are posting " +
			"long or unformatted snippets of code " +
			"and advise them how to do better.");
	}

	if (!text) {
		return next();
	}

	const hasUnformattedCode = /^\t|^ {2}/m.test(withoutCodeBlocks(message));
	const longCodeBlocks = getLongCodeBlocks(message);

	if (longCodeBlocks.length) {
		reply(
			"Kattaroq hajmdagi kodni jo`natganga o`xshaysiz, " +
			"uni tahrirlang va hastebin.com ga qo`yib " +
			"guruhga linkni tashashamg. " +
			"Yoki kodinggizni fayl shaklda jo`nating.",
			replyOptions);
	}

	else if (hasUnformattedCode) {
		reply(
			"Iltimos jo`natgan xabaringizni, " +
			"uchtalik backtic(`) bilan tahrirlang",
			replyOptions);
	}

	return next();
};

// for embedding in another bot
module.exports = createHandler({ replyToPm: false });

// for running standalone via micro-bot
module.exports.botHandler = createHandler({ replyToPm: true });
'use strict';

// Bot
const { replyOptions } = require('../../bot/options');

// DB
const { isAdmin, isBanned } = require('../../stores/user');

// Actions
const check = require('../../actions/check');

const checkHandler = async (ctx) => {
	const { message, reply} = ctx;

	if (ctx.from.status !== 'admin') return null;

	if (message.chat.type === 'private') {
		

		return check({ admin: ctx.from, reason, userToBan }).then(ctx.replyWithHTML);
	}
	else{
		return null;
	}
};

module.exports = checkHandler;

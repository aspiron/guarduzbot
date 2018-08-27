'use strict';

const unmatchedHandler = ctx => {
	ctx.state[unmatchedHandler.unmatched] = true;
	if (ctx.chat && ctx.chat.type === 'private') {
		ctx.reply('Uzr, sizni tushunolmadim, yordam kerakmi /help?');
	}
};

unmatchedHandler.unmatched = Symbol('unmatchedHandler.unmatched');

module.exports = unmatchedHandler;

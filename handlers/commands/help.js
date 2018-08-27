'use strict';
const { Markup } = require('telegraf');
const { homepage } = require('../../package.json');

const message = `\
Assalom alaykum!

Men <b>boshqaruvchu</b> botman sizga  \
 <b>guruhlaringizni spammerlar</b>dan saqlashga yordamlashaman.

/commands buyrug'ini yuboring va men sizga mavjud buyruqlarni jo'nataman.

Lekin faqat bitta guruh uchun bo'lsa @GroupButler_bot \
va @mattatabot siz uchun to'g'ri tanlov.
`;

const helpHandler = ({ chat, replyWithHTML }) => {
	if (chat.type !== 'private') return null;

	return replyWithHTML(
		message,
		Markup.inlineKeyboard([
			Markup.urlButton('🛠 Yangi bot yaratish', homepage)
		]).extra()
	);
};

module.exports = helpHandler;

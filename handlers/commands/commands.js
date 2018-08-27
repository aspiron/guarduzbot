'use strict';

const R = require('ramda');

// DB
const { listCommands } = require('../../stores/command');

// cfg
const { isMaster } = require('../../utils/config');

const { scheduleDeletion } = require('../../utils/tg');

const masterCommands = `\
<b>Master buyruqlar</b>:
<code>/admin</code> - userni admin qilish
<code>/unadmin</code> - adminlik huquqini olish
<code>/leave &lt;name|id&gt;</code> - botni guruhdan chiqarish
<code>/hidegroup</code> - <code>/groups</code> ro\'yxatida ko'rsatishni taqiqlash
<code>/showgroup</code> - <code>/groups</code> ro\'yxatida ko'rsatish\n
`;

const adminCommands = `\
<b>Admin buyruqlar</b>:
<code>/warn &lt;reason&gt;</code> - Userni ogohlantirish.
<code>/unwarn</code> - So'ngi ogohlantirishni olish.
<code>/nowarns</code> - User ogohlantirishlarini 0 ga tushirish.
<code>/ban &lt;reason&gt;</code> - Guruhdan userni banlash.
<code>/unban</code> - Ban listdan userni olish.
<code>/user</code> - User maqomini ko'rish va ogohlantirish.
<code>/addcommand &lt;name&gt;</code> - buyruq qo'shish.
<code>/removecommand &lt;name&gt;</code> - buyruqni o'chirish.\n
`;
const userCommands = `\
<b>Hamma uchun buyruqlar</b>:
<code>/staff</code> - Adminlar ro'yxatini ko'rsatish.
<code>/link</code> - Joriy guruh linkini ko'rsatish.
<code>/groups</code> - Bot admin bo'lgan guruhlar ro'yxatini ko'rsatish.
<code>/report</code> - Adminga nimanidir report qilish.\n
`;
const role = R.prop('role');
const name = R.prop('name');

const commandReferenceHandler = async (ctx) => {
	const customCommands = await listCommands();

	const customCommandsGrouped = R.groupBy(role, customCommands);
	const userCustomCommands = customCommandsGrouped.everyone
		? '[everyone]\n<code>' +
		customCommandsGrouped.everyone
			.map(name)
			.join(', ') +
		'</code>\n\n'
		: '';

	const adminCustomCommands = customCommandsGrouped.admins
		? '[admins]\n<code>' +
		customCommandsGrouped.admins
			.map(name)
			.join(', ') +
		'</code>\n\n'
		: '';

	const masterCustomCommands = customCommandsGrouped.master
		? '[master]\n<code>' +
		customCommandsGrouped.master
			.map(name)
			.join(', ') +
		'</code>\n\n'
		: '';

	const customCommandsText = masterCommands.repeat(isMaster(ctx.from)) +
		adminCommands.repeat(ctx.from.status === 'admin') +
		userCommands +
		'\n<b>Buyruqlar(! old belgisi bilan):</b>\n' +
		masterCustomCommands.repeat(isMaster(ctx.from)) +
		adminCustomCommands.repeat(ctx.from.status === 'admin') +
		userCustomCommands;

	return ctx.replyWithHTML(customCommandsText)
		.then(scheduleDeletion);
};

module.exports = commandReferenceHandler;

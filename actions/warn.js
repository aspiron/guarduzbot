'use strict';

const dedent = require('dedent-js');

const { context } = require('../bot');
const { link } = require('../utils/tg');
const { numberOfWarnsToBan } = require('../config');
const { warn } = require('../stores/user');
const ban = require('./ban');


module.exports = async ({ admin, userToWarn, reason }) => {
	const by_id = admin.id;
	const date = new Date();

	const { warns } = await warn(userToWarn, { by_id, date, reason });

	const isLastWarn = ', <b>oxirgi ogohlantirish!</b>'
		.repeat(warns.length === numberOfWarnsToBan - 1);

	const warnMessage = dedent(`
		⚠️ ${link(admin)} <b>admin</b> ${link(userToWarn)}ni <b>ogohlantirdi</b> <b>sabab</b>:

		${reason} (${warns.length}/${numberOfWarnsToBan}${isLastWarn})`);

	if (warns.length >= numberOfWarnsToBan) {
		await ban({
			admin: context.botInfo,
			reason: 'Maximum ogohlantirish soniga yetdingiz',
			userToBan: userToWarn,
		});
		return warnMessage +
			'\n\n' +
			'🚫 Ushbu user <b>banlandi</b>, ' +
			`U ${numberOfWarnsToBan}ta ogohlantirish bo'lgani uchun!`;
	}

	return warnMessage;
};

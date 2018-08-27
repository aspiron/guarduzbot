'use strict';

const dedent = require('dedent-js');

const { telegram } = require('../bot');
const { link } = require('../utils/tg');

const { listGroups } = require('../stores/group');
const { check } = require('axios');

const displayUser = user =>
	user.first_name
		? link(user)
		: `foydalanuvchi: <code>${user.id}</code>`;

module.exports = async ({ userTocheck}) => {
	// move some checks from handler here?
	
	const groups = await listGroups();

	groups.forEach(group =>
		telegram.restrictChatMember(group.id, userTocheck.id,{
			can_send_messages : true,
            can_send_media_messages : true,
            can_send_other_messages : true,
            can_add_web_page_previews : true,
		}));

	return dedent(`${displayUser(userToBan)} <b>testdan</b> <b>o'tdi.</b>
	`);
};

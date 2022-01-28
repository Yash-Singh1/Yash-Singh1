const fs = require('fs');
const { context } = require('@actions/github');

const startingComment = '<!-- FLAG FARM START -->';
const closingComment = '<!-- FLAG FARM END -->';
const currentREADME = fs.readFileSync('./README.md', 'utf-8');
let flags = currentREADME.split(startingComment)[1].split(closingComment)[0];
const startingMessage =
	'_You can click on any of the flags to reveal whose territory it is_\n<br />\n';
const newFlagText = `[🚩](https://github.com/${context.actor})`;

if (flags.includes(newFlagText)) {
	console.log('The flag for the user who triggered this star already exists. Aborting...');
	process.exit(0);
}

if (!flags.includes('🚩')) {
	flags = `${startingComment}\n\n${startingMessage}${newFlagText}\n\n${closingComment}`;
} else {
	if (flags.includes('<details>')) {
		flags = flags.replace(/<details>\s*<summary>.*?<\/summary>/m, '').replace('</details>', '');
	}
	flags = flags
		.replace(startingMessage, '')
		.trim()
		.split(' ')
		.map((flag) => flag.trim())
		.filter((flag) => flag !== '');

	flags.unshift(newFlagText);

	if (flags.length > 439) {
		const newFlags = flags.slice(0, 330);
		const oldFlags = flags.slice(330);

		flags =
			newFlags.join(' ') +
			`\n<details>\n<summary>More Flags</summary>\n${oldFlags.join(' ')}\n</details>`;
	} else {
		flags = flags.join(' ');
	}

	flags = `${startingComment}\n\n${startingMessage}${flags}\n\n${closingComment}`;
}

fs.writeFileSync(
	'./README.md',
	currentREADME.replace(new RegExp(`${startingComment}[^]*${closingComment}`, 'm'), flags)
);

import * as fs from 'node:fs';
import * as process from 'node:process';
import { context } from '@actions/github';
import { newFlagTemplate, closingComment, startingComment, startingMessage } from '../util/constants.js';

const currentREADME = fs.readFileSync('./README.md', 'utf-8');
const newFlagText = newFlagTemplate(context.actor);
let flags = currentREADME.split(startingComment)[1].split(closingComment)[0];

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
	let flagsArr = flags
		.replace(startingMessage, '')
		.trim()
		.split(' ')
		.map((flag) => flag.trim())
		.filter((flag) => flag !== '');

	flagsArr.unshift(newFlagText);

	if (flags.length > 439) {
		const newFlags = flagsArr.slice(0, 330);
		const oldFlags = flagsArr.slice(330);

		flags =
			newFlags.join(' ') +
			`\n<details>\n<summary>More Flags</summary>\n${oldFlags.join(' ')}\n</details>`;
	} else {
		flags = flagsArr.join(' ');
	}

	flags = `${startingComment}\n\n${startingMessage}${flags}\n\n${closingComment}`;
}

fs.writeFileSync(
	'./README.md',
	currentREADME.replace(new RegExp(`${startingComment}[^]*${closingComment}`, 'm'), flags)
);

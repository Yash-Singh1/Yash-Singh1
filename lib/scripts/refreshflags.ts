import * as fs from 'node:fs';
import { Octokit } from '@octokit/action';
import { owner, repo, startingComment, startingMessage, closingComment, newFlagTemplate } from '../util/constants.js';

let page = 1;
let result: any[] = [{}];
let all = [];
while (result.length !== 0) {
	const octokit = new Octokit();
	const { data } = await octokit.request('GET /repos/{owner}/{repo}/stargazers', {
		owner,
		repo,
		page
	});
	result = data;
	all.concat(...result);
}

all.map(({ login }) => {
	return newFlagTemplate(login);
});

let fileContent: string = fs.readFileSync('./README.md', 'utf-8');
let fileParts: string[] = fileContent.split(startingComment);
fileParts.push(fileContent[1].split(closingComment)[1]);
fileParts[1] = fileContent[1].split(closingComment)[0];

if (all.length === 0) {
	fileParts[1] = 'No flags found. Star this repository to get your flag planted here!';
} else if (all.length > 439) {
	const newFlags = all.slice(0, 330);
	const oldFlags = all.slice(330);
	fileParts[1] =
		newFlags.join(' ') +
		`\n<details>\n<summary>More Flags</summary>\n${oldFlags.join(' ')}\n</details>`;
} else {
	fileParts[1] = all.join(' ');
}

fileParts[1] = `${startingComment}\n\n${startingMessage}${fileParts[1]}\n\n${closingComment}`;

fileContent = fileParts.join('');

fs.writeFileSync('README.md', fileContent);

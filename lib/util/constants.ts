import * as process from "node:process";
import 'dotenv/config';

export const startingComment: string = '<!-- FLAG FARM START -->';
export const closingComment: string = '<!-- FLAG FARM END -->';
export const startingMessage: string =
	'_You can click on any of the flags to reveal whose territory it is_\n<br />\n';
export const newFlagTemplate = (username: string) => `[🚩](https://github.com/${username})`;
export const [owner, repo] = process.env.GITHUB_REPOSITORY!.split('/');

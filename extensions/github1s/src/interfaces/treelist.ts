import _ajaxData from './1061';
import { toUint8Array as decodeBase64, encode } from 'js-base64';
import {
	fetch,
	RequestError,
	RequestRateLimitError,
	RequestInvalidTokenError,
	RequestNotFoundError,
	throttledReportNetworkError,
} from '@/helpers/fetch';
import * as vscode from 'vscode';

let ajaxData;

export default {
	async getGitHubAllFiles(obj) {
		const browserUrl = (await await vscode.commands.executeCommand(
			'github1s.vscode.get-browser-url'
		)) as string;
		const { path, query, fragment } = vscode.Uri.parse(browserUrl);
		console.log(path, query, fragment);
		let res = await fetch(`/api/execute?` + query);
		/*new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve({
					data: _ajaxData.data,
				});
			}, 10000);
		});*/
		ajaxData = res.data;
		let keys = Object.keys(ajaxData);
		let map = {};
		let tree = [];
		keys.forEach((key) => {
			let l = key.replace(/\.vm$/, '').split('/');
			let max = l.length - 1;
			l.forEach((p, i) => {
				let path = l.slice(0, i + 1).join('/');
				if (!map[path]) {
					tree.push({
						path,
						type: i === max ? 'blob' : 'tree',
						sha: key,
					});
					map[path] = 1;
				}
			});
		});
		return Promise.resolve({
			tree,
		});
	},
	readGitHubFile(obj) {
		let { fileSha } = obj;
		return Promise.resolve({
			sha: fileSha,
			content: encode(ajaxData[fileSha]),
			encoding: 'base64',
		});
	},
};

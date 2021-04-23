import _ajaxData from './1061';
import { toUint8Array as decodeBase64, encode } from 'js-base64';
const ajaxData = _ajaxData.data;

export default {
	getGitHubAllFiles(obj) {
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
		console.log(tree);
		return Promise.resolve({
			tree,
		});
	},
	readGitHubFile(obj) {
		// return Promise.resolve({
		// 	sha: obj.fileSha,
		// 	content:
		// 		'cGFja2FnZSBjb20uc2l0ZS5zcHJpbmdib290LmNvcmUuY29uZmlnOwoKLyoq\nCiAqIEBhdXRob3IgMTMKICogQHFx5Lqk5rWB576kIDc5Njc5NDAwOQogKiBA\nZW1haWwgMjQ0OTIwNzQ2M0BxcS5jb20KICogQGxpbmsgaHR0cDovLzEzYmxv\nZy5zaXRlCiAqLwpwdWJsaWMgY2xhc3MgQ29uc3RhbnRzIHsKCiAgICBwdWJs\naWMgZmluYWwgc3RhdGljIFN0cmluZyBGSUxFX1VQTE9BRF9QQVRIID0gIi9o\nb21lL3Byb2plY3QvdXBsb2FkLyI7Ly/kuIrkvKDmlofku7bnmoTkv53lrZjl\nnLDlnYDvvIzmoLnmja7pg6jnvbLorr7nva7oh6rooYzkv67mlLkKCn0K\n',
		// 	encoding: 'base64',
		// });

		let { fileSha } = obj;
		return Promise.resolve({
			sha: fileSha,
			content: encode(ajaxData[fileSha]),
			encoding: 'base64',
		});
	},
};

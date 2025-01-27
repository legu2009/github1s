/**
 * @file extension entry
 * @author netcon
 */

import * as vscode from 'vscode';
import { setExtensionContext } from '@/helpers/context';
import { registerGitHub1sCommands } from '@/commands';
import { registerVSCodeProviders } from '@/providers';
import { registerCustomViews } from '@/views';
import { GitHub1sFileSystemProvider } from '@/providers/fileSystemProvider';
import { showSponsors } from '@/sponsors';
import { showGitpod } from '@/gitpod';
import router from '@/router';
import { activateSourceControl } from '@/source-control';
import { registerEventListeners } from '@/listeners';
import { PageType } from './router/types';
export async function activate(context: vscode.ExtensionContext) {
	const browserUrl = (await await vscode.commands.executeCommand(
		'github1s.vscode.get-browser-url'
	)) as string;

	console.log(browserUrl);

	// set the global context for convenient
	setExtensionContext(context);
	// Ensure the router has been initialized at first
	await router.initialize(browserUrl);

	// register the necessary event listeners
	registerEventListeners();
	// register VS Code providers
	registerVSCodeProviders();
	// register custom views
	registerCustomViews();
	// register GitHub1s Commands
	registerGitHub1sCommands();

	// activate SourceControl features,
	activateSourceControl();

	// sponsors in Status Bar
	//showSponsors();
	//await showGitpod();

	// open corresponding editor if there is a filePath specified in browser url
	const { filePath, pageType } = await router.getState();
	console.log('filePath, pageType', filePath, pageType);
	if (filePath && [PageType.TREE, PageType.BLOB].includes(pageType)) {
		vscode.commands.executeCommand(
			pageType === PageType.TREE ? 'revealInExplorer' : 'vscode.open',
			vscode.Uri.parse('').with({
				scheme: GitHub1sFileSystemProvider.scheme,
				path: filePath,
			})
		);
	}
	// } else if (pageType === PageType.PULL_LIST) {
	// 	vscode.commands.executeCommand('github1s.views.pull-request-list.focus');
	// } else if (pageType === PageType.COMMIT_LIST) {
	// 	vscode.commands.executeCommand('github1s.views.commit-list.focus');
	// } else if ([PageType.PULL, PageType.COMMIT].includes(pageType)) {
	// 	vscode.commands.executeCommand('workbench.scm.focus');
	// }
	//vscode.
}

import * as vscode from 'vscode';
import * as fs from 'fs';
import axios from 'axios';

let config_output;
const init_config_output = () => {
	config_output = JSON.parse(fs.readFileSync(vscode.window.activeTextEditor.document.uri.fsPath.match(/.*\//g) + 'config.json', 'utf8'));
};

const create_config = () => {
	let config = {
		authorization: [
			{
				sitename: '',
				username: '',
				password: ''
			}
		],
		email: [
			{
				id: '',
				name: '',
				subject: ''
			}
		]
	};
	fs.writeFileSync(vscode.window.activeTextEditor.document.uri.fsPath.match(/.*\//g) + 'config.json', JSON.stringify(config, null, 4));
	vscode.window.showInformationMessage('Success! A config file has been created.');
};

const create_email = () => {
	init_config_output();
	axios
		.get('https://login.eloqua.com/id', {
			headers: {
				Authorization: 'Basic ' + Buffer.from(config_output.authorization[0].sitename + '\\' + config_output.authorization[0].username + ':' + config_output.authorization[0].password).toString('base64'),
				'Content-Type': 'application/json'
			}
		})
		.then(function(response) {
			console.log(response.data);
			if (response.data == 'Not authenticated.') {
				vscode.window.showErrorMessage('Error! The login details provided were incorrect.');
				return;
			}
			axios
				.post(
					response.data.urls.base + '/api/REST/2.0/assets/email',
					{
						name: config_output.email[0].name,
						subject: config_output.email[0].subject,
						htmlContent: {
							type: 'RawHtmlContent',
							html: vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selections[10000000])
						}
					},
					{
						headers: {
							Authorization: 'Basic ' + Buffer.from(config_output.authorization[0].sitename + '\\' + config_output.authorization[0].username + ':' + config_output.authorization[0].password).toString('base64'),
							'Content-Type': 'application/json'
						}
					}
				)
				.then(function(response) {
					console.log(response.data);
					vscode.window.showInformationMessage('Success! This email has been created.');
					config_output.email[0].id = response.data.id;
					fs.writeFileSync(vscode.window.activeTextEditor.document.uri.fsPath.match(/.*\//g) + 'config.json', JSON.stringify(config_output, null, 4));
				})
				.catch(function(error) {
					console.log(error.response.data);
					vscode.window.showErrorMessage('Error! Please define an email ' + error.response.data[0].property + ' in the config file.');
				});
		})
		.catch(function(error) {
			console.log(error.response.data);
		});
};

const update_email = () => {
	init_config_output();
	axios
		.get('https://login.eloqua.com/id', {
			headers: {
				Authorization: 'Basic ' + Buffer.from(config_output.authorization[0].sitename + '\\' + config_output.authorization[0].username + ':' + config_output.authorization[0].password).toString('base64'),
				'Content-Type': 'application/json'
			}
		})
		.then(function(response) {
			console.log(response.data);
			if (response.data == 'Not authenticated.') {
				vscode.window.showErrorMessage('Error! The login details provided were incorrect.');
				return;
			}
			axios
				.put(
					'https://secure.p02.eloqua.com/api/REST/2.0/assets/email/' + config_output.email[0].id,
					{
						id: config_output.email[0].id,
						name: config_output.email[0].name,
						subject: config_output.email[0].subject,
						htmlContent: {
							type: 'RawHtmlContent',
							html: vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selections[10000000])
						}
					},
					{
						headers: {
							Authorization: 'Basic ' + Buffer.from(config_output.authorization[0].sitename + '\\' + config_output.authorization[0].username + ':' + config_output.authorization[0].password).toString('base64'),
							'Content-Type': 'application/json'
						}
					}
				)
				.then(function(response) {
					console.log(response.data);
					vscode.window.showInformationMessage('Success! This email has been updated.');
				})
				.catch(function(error) {
					console.log(error.response.data);
					vscode.window.showErrorMessage('Error! Please define an email ' + error.response.data[0].property + ' in the config file.');
				});
		})
		.catch(function(error) {
			console.log(error.response.data);
		});
};

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.mailzapconfig', create_config));
	context.subscriptions.push(vscode.commands.registerCommand('extension.mailzapcreate', create_email));
	context.subscriptions.push(vscode.commands.registerCommand('extension.mailzapupdate', update_email));
}

export function deactivate() {}

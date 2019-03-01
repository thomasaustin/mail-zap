import * as vscode from 'vscode';
import * as fs from 'fs';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {

	// create email command
	let create = vscode.commands.registerCommand('extension.mailzapcreate', () => {

		// read data in config file
		var file_path = vscode.window.activeTextEditor.document.uri.fsPath
		var folder_path = file_path.match(/.*\//g);
		var config_data = JSON.parse(fs.readFileSync(folder_path + "config.json", "utf8"));

		// set api variables
		var auth_sitename = config_data.authorization[0].sitename
		var auth_username = config_data.authorization[0].username
		var auth_password = config_data.authorization[0].password
		var access_token = 'Basic ' + Buffer.from(auth_sitename + '\\' + auth_username + ':' + auth_password).toString('base64')
		var email_name = config_data.email[0].name
		var email_subject = config_data.email[0].subject

		// select all text in active document
		var editor = vscode.window.activeTextEditor;
		var selection = editor.selections[10000000]
		var email_html = editor.document.getText(selection);

		// create email via api
		if (!auth_sitename || !auth_username || !auth_password) {
			vscode.window.showErrorMessage('Error! Authorization credentials have not been defined in the config file.')
		} else if (!email_name) {
			vscode.window.showErrorMessage('Error! An email name has not been defined in the config file.')
		} else {
			axios.post('https://secure.p02.eloqua.com/api/REST/2.0/assets/email', {
					"name": email_name,
					"subject": email_subject,
					"htmlContent": {
						"type": "RawHtmlContent",
						"html": email_html
					}
				}, {
					headers: {
						Authorization: access_token
					}
				})
				.then(function (response) {
					console.log(response.data);
					vscode.window.showInformationMessage('Success! This email has been created.');
					// update email id in config file
					config_data.email[0].id = response.data.id;
					fs.writeFileSync(folder_path + "config.json", JSON.stringify(config_data, null, 2));
				})
				.catch(function (error) {
					console.log(error.response.data);
				});
		}

	});
	context.subscriptions.push(create);

	// update email command
	let update = vscode.commands.registerCommand('extension.mailzapupdate', () => {

		// read data in config file
		var file_path = vscode.window.activeTextEditor.document.uri.fsPath
		var folder_path = file_path.match(/.*\//g);
		var config_data = JSON.parse(fs.readFileSync(folder_path + "config.json", "utf8"));

		// set api variables
		var auth_sitename = config_data.authorization[0].sitename
		var auth_username = config_data.authorization[0].username
		var auth_password = config_data.authorization[0].password
		var access_token = 'Basic ' + Buffer.from(auth_sitename + '\\' + auth_username + ':' + auth_password).toString('base64')
		var email_id = config_data.email[0].id
		var email_name = config_data.email[0].name
		var email_subject = config_data.email[0].subject

		// select all text in active document
		var editor = vscode.window.activeTextEditor;
		var selection = editor.selections[10000000]
		var email_html = editor.document.getText(selection);

		// update email via api
		if (!auth_sitename || !auth_username || !auth_password) {
			vscode.window.showErrorMessage('Error! Authorization credentials have not been defined in the config file.')
		} else if (!email_id) {
			vscode.window.showErrorMessage('Error! An email id has not been defined in the config file.')
		} else if (!email_name) {
			vscode.window.showErrorMessage('Error! An email name has not been defined in the config file.')
		} else {
			axios.put('https://secure.p02.eloqua.com/api/REST/2.0/assets/email/' + email_id, {
					"id": email_id,
					"name": email_name,
					"subject": email_subject,
					"htmlContent": {
						"type": "RawHtmlContent",
						"html": email_html
					}
				}, {
					headers: {
						Authorization: access_token
					}
				})
				.then(function (response) {
					console.log(response.data);
					vscode.window.showInformationMessage('Success! This email has been updated.')
				})
				.catch(function (error) {
					console.log(error.response.data);
				})
		}

	});
	context.subscriptions.push(update);

}
export function deactivate() {}
# Mail Zap

Use this extension to create and update Eloqua HTML emails within Visual Studio Code.

## Getting Started

Be sure to enable API access for Eloqua before starting.

1. Install this extension from the Visual Studio Code Marketplace.
2. Create a folder containing your HTML email and open it in the editor.
3. With your HTML email active, open the command palette `Ctrl-Shift-P` (Windows/Linux) or `Cmd-Shift-P` (macOS) and type 'Mail Zap'.
4. Select 'Mail Zap: Create Config' to generate the configuration file which will be used to contain your login credentials and basic email details.
5. Fill in these details in the newly created `config.json` file. Note: Only add an id when updating an existing email. If creating a new email the id will be populated automatically.
```
{
  "authorization": [
    {
      "sitename": "",
      "username": "",
      "password": ""
    }
  ],
  "email": [
    {
      "id": "",
      "name": "",
      "subject": ""
    }
  ]
}
```
6. With your HTML email active, open the command palette again and select either 'Mail Zap: Create Email' or 'Mail Zap: Update Email' depending on your needs.

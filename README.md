# Mail Zap

Use this extension to create and update Eloqua HTML emails within Visual Studio Code.

## Getting Started

1. Install the Mail Zap extension from the Visual Studio Marketplace.
2. Create a folder containing your HTML email along with a json file titled `config.json`
3. Add the code below to the new json file and fill in your Eloqua login credentials and basic email details.\
Note: Only add an id when updating an existing email. If creating a new email the id will be populated automatically.

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
4. With your HTML email active, open the command palette `Ctrl-Shift-P` (Windows/Linux) or `Cmd-Shift-P` (macOS) and type 'Mail Zap'.
5. Select either 'Mail Zap: Create Email' or 'Mail Zap: Update Email' depending on your needs.

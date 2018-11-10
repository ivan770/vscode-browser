const vscode = require('vscode');
const path = require('path');

function getWebviewContent(cssFile) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VSCode Browser</title>
    <link rel="stylesheet" href="${cssFile}">
</head>
<body>
    <style>
    body.vscode-light {
        background: white;
    }
    
    body.vscode-dark {
        background: #0f111a;
    }
    
    body.vscode-high-contrast {
        background: red;
    }    
    </style>
    <script>
        const vscode = acquireVsCodeApi();
        function goURL(){
            vscode.postMessage({
                type: 'url',
                url: document.getElementById("url").value
            });
            document.getElementById("iframe-main").src = document.getElementById("url").value;
            // document.getElementById("go").classList.add("loading");
        }

        function listenToEnter(e){
            if (e.keyCode == 13) {
                goURL();
            }
        }

        /*function loadComplete(){
            document.getElementById("go").classList.remove("loading");
        }*/
    </script>
    <div class="container">
        <div class="column col-12">
            <div class="input-group">
                <input type="text" class="form-input tooltip tooltip-bottom" placeholder="URL" id="url" onkeypress="listenToEnter(event)" data-tooltip="Make sure that website doesn't block iframe's">
                <button id="go" class="btn btn-primary input-group-btn" onclick="goURL()">Go</button>
            </div>
            <iframe id="iframe-main" src="" style="height: 100%; width: 95.7%; position: absolute"></iframe>
        </div>
    </div>
</body>
</html>`;
}

function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('vscode-browser.openWindow', function () {
        const panel = vscode.window.createWebviewPanel(
            'browser',
            "Empty browser window",
            vscode.ViewColumn.One,
            { 
                retainContextWhenHidden: true,
                enableScripts: true
            }
        );

        panel.onDidDispose(null,null,context.subscriptions)

        // Load CSS
        const diskPath = vscode.Uri.file(path.join(context.extensionPath, 'assets', 'spectre.min.css'));
        const cssFile = diskPath.with({ scheme: 'vscode-resource' });

        panel.webview.onDidReceiveMessage(message => {
            switch (message.type) {
                case 'url':
                    panel.title=message.url;
                    return;
            }
        }, undefined, context.subscriptions);

        panel.webview.html = getWebviewContent(cssFile);
    }));
}

exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
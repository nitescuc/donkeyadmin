const request = require('superagent');

export const getTubes = async (baseUrl, onMessage) => {
    const url = `${baseUrl || ''}/api/tubes`;
    const resp = await request.get(url);
    if (onMessage) onMessage(`${new Date().toISOString()} - GET - ${url} - ${resp.status}`);
    return (resp || {}).body || [];
}

export const downloadTube = (baseUrl, tubeUrl, tubeName, onMessage) => {
    const oReq = new XMLHttpRequest();
    oReq.open("GET", `${baseUrl || ''}/api/${tubeUrl}`, true);
    oReq.responseType = "arraybuffer";

    let lastLoaded = 0;
    
    oReq.onload = function(oEvent) {
      const blob = new Blob([oReq.response], {type: "application/zip"});
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = tubeName + '.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    };
    oReq.addEventListener("progress", (event) => {
        if (onMessage) {
            if (Math.round(event.loaded / 1000000) !== Math.round(lastLoaded / 1000000)) {
                lastLoaded = event.loaded;
                onMessage(`${new Date().toISOString()} - DOWNLOAD - ${Math.round(event.loaded/1000)}k`);
            }
        }
    });
    
    oReq.send();
}
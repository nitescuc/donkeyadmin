const request = require('superagent');

export const getModels = async (baseUrl, onMessage) => {
    const url = `${baseUrl || ''}/api/models`;
    const resp = await request.get(url);
    if (onMessage) onMessage(`${new Date().toISOString()} - GET - ${url} - ${resp.status}`);
    return (resp || {}).body || [];
}

export const executeLink = async (baseUrl, link, onMessage) => {
    const url = `${baseUrl || ''}/api${link.$url}`;
    const method = (link.$method || 'get').toLowerCase();
    const resp = await request[method](url);
    if (onMessage) onMessage(`${new Date().toISOString()} - ${method} - ${url} - ${resp.status}`);
    return (resp || {}).body || {};
}

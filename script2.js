// function start() {

//     fetch('./assets/settings/pages_markdown.json')
//         .then(resp => resp.json())
//         .then(readMarkdown)
//         .catch(err => console.log(err));
// }

// function readMarkdown(data) {

//     const container = document.getElementById('page-content');

//     const markdownText = data[0].content;

//     console.log(markdownText);

//     container.innerHTML = marked.parse(markdownText);
// }



function initWebsiteMarkdown() {
    fetchGeneralSettingsMarkdown();
    fetchPageSettingsMarkdown();
}

function fetchGeneralSettingsMarkdown() {
    fetch('./assets/settings/setting.json')
        .then(resp => resp.json())
        .then(generalSettings)
        .catch(err => console.log(err));
}

function generalSettings(data) {
    const theme = data.theme;
    const title = data.title;
    const headerImage = data.headerImage;
    const footerLinks = data.footerLinks;

    const linkCSS = document.getElementById('styleLinkTag');
    if (theme.toLowerCase() === 'light') {
        linkCSS.setAttribute('href', './style.css');
    }
    if (theme.toLowerCase() === 'dark') {
        linkCSS.setAttribute('href', './styleDark.css');
    }
    if (theme.toLowerCase() === 'lateral-menu') {
        linkCSS.setAttribute('href', './lateral-menu.css');
    }
    
    // Imposto titolo documento
    document.title = title;

    // Imposto titolo header
    const headerTitle = document.getElementById('main-title');
    const titleTextNode = document.createTextNode(title);
    headerTitle.appendChild(titleTextNode);

    // Cambio background image header
    const header = document.getElementById('header');
    header.style.backgroundImage = 'url(' + headerImage + ')';

    // Genero i footer links
    const linkDiv = document.getElementById('link-container');

    for (const link of footerLinks) {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        const textNode = document.createTextNode(link.text);
        a.appendChild(textNode);
        linkDiv.appendChild(a);
    }
}

// ---- //

function fetchPageSettingsMarkdown() {
    // fetch('./assets/settings/pages_markdown.json')
    //     .then(resp => resp.json())
    //     .then(pageSettingsMarkdownCode)
    //     .catch(err => console.log(err));

    fetch('./assets/settings/pages-markdown-url.json')
        .then(resp => resp.json())
        .then(pageSettingsMarkdownUrl)
        .catch(err => console.log(err));
}

function pageSettingsMarkdownCode(data) {
    setNavMenu(data);
    const paramsString = window.location.search;
    const params = new URLSearchParams(paramsString);
    let id = params.get('id');
    if(!id) {
        id = "p1"
    }
    const page = data.filter(p => p.id === id)[0];
    const divContent = document.getElementById('page-content');
    
    const parsedText = marked.parse(page.content);

    divContent.innerHTML = parsedText;
}

function pageSettingsMarkdownUrl(data) {
    setNavMenu(data);
    const paramsString = window.location.search;
    const params = new URLSearchParams(paramsString);
    let id = params.get('id');
    if(!id) {
        id = "p1"
    }
    const page = data.filter(p => p.id === id)[0];
    fetch(page.content)
        .then(resp => resp.json())
        .then(displayMarkdownFromUrl)
        .catch(err => console.log(err));
}

function displayMarkdownFromUrl(data) {
    const divContent = document.getElementById('page-content');
    
    const parsedText = marked.parse(data);

    divContent.innerHTML = parsedText;
}

function setNavMenu(pageSetting) {
    const navMenu = document.getElementById('nav-menu');
    for (const page of pageSetting) {
        const a = document.createElement('a');
        a.id = page.id;
        const node = document.createTextNode(page.name);
        a.appendChild(node);
        // const baseUrl = window.location.toString().split("=")[0];
        // const url = baseUrl + "=" + page.id;
        const url = "/?id=" + page.id;
        a.href = url;
        navMenu.appendChild(a);
    }
}
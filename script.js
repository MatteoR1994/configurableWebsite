function initWebsite() {
    fetchGeneralSettings();
    // fetchPageSettings();
    fetchNewPageSettings();
}

function fetchGeneralSettings() {
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

function fetchPageSettings() {
    fetch('./assets/settings/pages_old.json')
        .then(resp => resp.json())
        .then(pageSettings)
        .catch(err => console.log(err));
}

function pageSettings(data) {
    setNavMenu(data);
    const paramsString = window.location.search;
    const params = new URLSearchParams(paramsString);
    let id = params.get('id');
    if(!id) {
        id = "p1"
    }
    const page = data.filter(p => p.id === id)[0];
    const divContent = document.getElementById('page-content');
    for (const element of page.content) {
        const tag = document.createElement(element.tag);
        if (element.tag.toLowerCase() === 'img') {
            tag.src = element.url;
            tag.style.width = '285px';
        } else {
            const textNode = document.createTextNode(element.text);
            tag.appendChild(textNode);
        }
        divContent.appendChild(tag);
    }
}

// ---- //

function fetchNewPageSettings() {
    fetch('./assets/settings/pages_new.json')
        .then(resp => resp.json())
        .then(newPageSettings)
        .catch(err => console.log(err));
}

const divContent = document.getElementById('page-content');

function newPageSettings(data) {
    setNavMenu(data);
    const paramsString = window.location.search;
    const params = new URLSearchParams(paramsString);
    let id = params.get('id');
    if(!id) {
        id = "p1"
    }
    const page = data.filter(p => p.id === id)[0];
    createNewPage(page.content);
}

function createNewPage(pageContent) {
    for (const element of pageContent) {
        if (Object.hasOwnProperty.call(element, "children")) {
            const children = element["children"];
            const child = generateChildren(children, element.tag);
            divContent.appendChild(child);
        } else {
            const newTag = createHTMLElement(element.tag, element.url, element.text);
            divContent.appendChild(newTag);
        }
    }
}

function generateChildren(childrenToCheck, tagToCreate) {
    const tagContainer = document.createElement(tagToCreate);
    for (const child of childrenToCheck) {
        if (Object.hasOwnProperty.call(child, "children")) {
            const children = child["children"];
            const subChild = generateChildren(children, child.tag);
            tagContainer.appendChild(subChild);
        } else {
            const newTag = createHTMLElement(child.tag, child.url, child.text);
            tagContainer.appendChild(newTag);
            
        }
    }
    return tagContainer;
}

function createHTMLElement(tagToCreate, url, text) {
    const tag = document.createElement(tagToCreate);
    if (tagToCreate.toLowerCase() === 'img') {
        tag.src = url;
        tag.style.width = '285px';
    } else {
        const textNode = document.createTextNode(text);
        tag.appendChild(textNode);
    }
    return tag;
}

function setNavMenu(pageSetting) {
    const navMenu = document.getElementById('nav-menu');
    for (const page of pageSetting) {
        const a = document.createElement('a');
        const node = document.createTextNode(page.name);
        a.appendChild(node);
        // const baseUrl = window.location.toString().split("=")[0];
        // const url = baseUrl + "=" + page.id;
        const url = "/?id=" + page.id;
        console.log(url);
        a.href = url;
        navMenu.appendChild(a);
    }
}
function initWebsite() {
    fetchGeneralSettings();
    fetchPageSettings();
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
    fetch('./assets/settings/pages.json')
        .then(resp => resp.json())
        .then(pageSettings)
        .catch(err => console.log(err));
}

function pageSettings(data) {
    const divContent = document.getElementById('page-content');
    for (const element of data[0].content) {
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
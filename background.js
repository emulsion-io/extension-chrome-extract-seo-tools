// Création des menus contextuels
chrome.contextMenus.create({
    id: "copy-alt-text",
    title: "Copier le ALT",
    contexts: ["image"]
  });
  
  chrome.contextMenus.create({
    id: "copy-title-text",
    title: "Copier le Title",
    contexts: ["all"]
  });
  
  chrome.contextMenus.create({
    id: "copy-meta-description-text",
    title: "Copier la meta description",
    contexts: ["all"]
  });
  
  // Écouteur sur le clic du menu contextuel
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab || !tab.id) return;
  
    if (info.menuItemId === "copy-alt-text") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyAltText,
        args: [info.srcUrl]
      });
    } else if (info.menuItemId === "copy-title-text") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyTitleText
      });
    } else if (info.menuItemId === "copy-meta-description-text") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyMetaDescriptionText
      });
    }
  });
  
  // Fonction injectée pour copier le ALT d'une image
  function copyAltText(srcUrl) {
    const images = document.querySelectorAll('img');
    let targetImg = null;
  
    images.forEach(img => {
      if (img.src === srcUrl || img.currentSrc === srcUrl || img.dataset.lazySrc === srcUrl) {
        targetImg = img;
      }
    });
  
    if (targetImg && targetImg.alt) {
      navigator.clipboard.writeText(targetImg.alt)
        .then(() => alert('ALT copié : ' + targetImg.alt))
        .catch(err => console.error('Erreur de copie :', err));
    } else {
      alert('Aucun ALT trouvé.');
    }
  }
  
  // Fonction injectée pour copier le title de la page
  function copyTitleText() {
    const pageTitle = document.title;
    navigator.clipboard.writeText(pageTitle || '')
      .then(() => alert('Title copié : ' + pageTitle))
      .catch(err => console.error('Erreur de copie :', err));
  }
  
  // Fonction injectée pour copier la meta description
  function copyMetaDescriptionText() {
    const metaDescription = document.querySelector('meta[name="description"]');
    const content = metaDescription ? metaDescription.content : '';
    navigator.clipboard.writeText(content || '')
      .then(() => alert('Meta description copiée : ' + content))
      .catch(err => console.error('Erreur de copie :', err));
  }
  
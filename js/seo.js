(function () {
  var siteUrl = 'https://www.pakanyo.co.za';
  var siteName = 'Pakanyo HR Solutions';

  var pages = {
    'index.html':        { title: 'Home',                    breadcrumb: [] },
    'about.html':        { title: 'About Us',                breadcrumb: ['About'] },
    'services.html':     { title: 'Our Services',            breadcrumb: ['Services'] },
    'programmes.html':   { title: 'Programmes & Solutions',  breadcrumb: ['Programmes'] },
    'gallery.html':      { title: 'Gallery',                 breadcrumb: ['Gallery'] },
    'references.html':   { title: 'References',              breadcrumb: ['References'] },
    'articles.html':     { title: 'Articles',                breadcrumb: ['Articles'] },
    'contact.html':      { title: 'Contact Us',              breadcrumb: ['Contact'] },
    'popia.html':        { title: 'POPIA Compliance',        breadcrumb: ['Privacy Policy'] },
    'article-ld-strategic-driver.html':  { title: 'Why L&D Must Be a Strategic Driver', breadcrumb: ['Articles', 'Why L&D Must Be a Strategic Driver'] },
    'article-pdp-leverage.html':         { title: 'How L&D Practitioners Can Leverage PDPs', breadcrumb: ['Articles', 'How L&D Practitioners Can Leverage PDPs'] },
    'article-qcto-transition.html':      { title: 'Navigating the QCTO Transition', breadcrumb: ['Articles', 'Navigating the QCTO Transition'] },
    'article-tna-process.html':          { title: 'How to Perfect Your TNA Process', breadcrumb: ['Articles', 'How to Perfect Your TNA Process'] },
    'blog.html':      { title: 'Blog',      breadcrumb: ['Blog'] },
    'blog-post.html': { title: 'Blog Post',  breadcrumb: ['Blog'] }
  };

  var path = window.location.pathname.split('/').pop() || 'index.html';
  var page = pages[path] || pages['index.html'];

  // BreadcrumbList schema
  var breadcrumbItems = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': siteName,
      'item': siteUrl + '/'
    }
  ];

  page.breadcrumb.forEach(function (crumb, i) {
    var itemUrl = siteUrl + '/';
    if (crumb === 'Articles') itemUrl = siteUrl + '/articles.html';
    else if (crumb === 'About') itemUrl = siteUrl + '/about.html';
    else if (crumb === 'Services') itemUrl = siteUrl + '/services.html';
    else if (crumb === 'Programmes') itemUrl = siteUrl + '/programmes.html';
    else if (crumb === 'Gallery') itemUrl = siteUrl + '/gallery.html';
    else if (crumb === 'References') itemUrl = siteUrl + '/references.html';
    else if (crumb === 'Contact') itemUrl = siteUrl + '/contact.html';
    else if (crumb === 'Privacy Policy') itemUrl = siteUrl + '/popia.html';
    else if (crumb === 'Blog') itemUrl = siteUrl + '/blog.html';
    else itemUrl = siteUrl + '/articles.html';

    breadcrumbItems.push({
      '@type': 'ListItem',
      'position': i + 2,
      'name': crumb,
      'item': itemUrl
    });
  });

  var breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems
  };

  // ContactPoint schema
  var contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': siteName,
    'url': siteUrl,
    'telephone': '+27-87-255-6507',
    'email': 'info@pakanyo.co.za',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+27-87-255-6507',
      'contactType': 'customer service',
      'email': 'info@pakanyo.co.za',
      'areaServed': 'ZA',
      'availableLanguage': 'English'
    }
  };

  function inject(data) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
  }

  inject(breadcrumbSchema);
  inject(contactSchema);
})();

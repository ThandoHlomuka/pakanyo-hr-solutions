(function () {
  if (!SUPABASE_CONFIG || !SUPABASE_CONFIG.url || SUPABASE_CONFIG.url.indexOf('YOUR_') === 0) {
    console.error('Supabase not configured. Edit js/config.js with your credentials.');
    return;
  }

  var baseUrl = SUPABASE_CONFIG.url + '/rest/v1';
  var headers = {
    'apikey': SUPABASE_CONFIG.anonKey,
    'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  window.BlogAPI = {

    getPosts: function (publishedOnly) {
      var query = '?order=created_at.desc';
      if (publishedOnly) query += '&published=eq.true';
      return fetch(baseUrl + '/blog_posts' + query, { headers: headers })
        .then(function (r) { return r.json(); });
    },

    getPostBySlug: function (slug) {
      return fetch(baseUrl + '/blog_posts?slug=eq.' + encodeURIComponent(slug) + '&select=*', { headers: headers })
        .then(function (r) { return r.json(); })
        .then(function (rows) { return rows[0] || null; });
    },

    getPostById: function (id) {
      return fetch(baseUrl + '/blog_posts?id=eq.' + id, { headers: headers })
        .then(function (r) { return r.json(); })
        .then(function (rows) { return rows[0] || null; });
    },

    createPost: function (post) {
      return fetch(baseUrl + '/blog_posts', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(post)
      }).then(function (r) { return r.json(); });
    },

    updatePost: function (id, updates) {
      return fetch(baseUrl + '/blog_posts?id=eq.' + id, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updates)
      }).then(function (r) { return r.json(); });
    },

    deletePost: function (id) {
      return fetch(baseUrl + '/blog_posts?id=eq.' + id, {
        method: 'DELETE',
        headers: headers
      }).then(function (r) { return r.ok; });
    },

    slugify: function (text) {
      return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 80);
    }
  };
})();

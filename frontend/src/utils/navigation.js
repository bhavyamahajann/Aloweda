/**
 * Handle navigation with support for opening links in new tab
 * @param {MouseEvent} event - Click event
 * @param {Function} onNavigate - Navigation function
 * @param {string} page - Page to navigate to
 * @param {object} params - Navigation parameters
 */
export const handleNavigation = (event, onNavigate, page, params = {}) => {
  // Check if Ctrl+Click (Windows/Linux) or Cmd+Click (Mac) or Middle Mouse Button
  const isNewTab = event.ctrlKey || event.metaKey || event.button === 1;
  
  if (isNewTab) {
    // Open in new tab
    event.preventDefault();
    const url = buildUrl(page, params);
    window.open(url, '_blank');
  } else {
    // Normal navigation
    onNavigate(page, params);
  }
};

/**
 * Build URL from page and params
 * @param {string} page - Page identifier
 * @param {object} params - URL parameters
 * @returns {string} Full URL
 */
const buildUrl = (page, params) => {
  const baseUrl = window.location.origin;
  
  // Handle product page
  if (page === 'product' && params.productId) {
    return `${baseUrl}/#product=${params.productId}`;
  }
  
  // Handle other pages
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return `${baseUrl}/#${page}?${queryString}`;
  }
  
  return `${baseUrl}/#${page}`;
};

/**
 * Make div/span behave like a link for accessibility
 * @param {Function} onNavigate - Navigation function
 * @param {string} page - Page to navigate to
 * @param {object} params - Navigation parameters
 * @returns {object} Props to spread on element
 */
export const linkProps = (onNavigate, page, params = {}) => ({
  role: 'link',
  tabIndex: 0,
  style: { cursor: 'pointer' },
  onClick: (e) => handleNavigation(e, onNavigate, page, params),
  onAuxClick: (e) => {
    // Handle middle mouse button click
    if (e.button === 1) {
      handleNavigation(e, onNavigate, page, params);
    }
  },
  onKeyDown: (e) => {
    // Handle Enter and Space key for accessibility
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation(e, onNavigate, page, params);
    }
  }
});

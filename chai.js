/**
 * ChaiCSS - Lightweight, utility-first runtime CSS engine
 * Scans DOM for chai-* classes and applies inline styles
 */

document.addEventListener('DOMContentLoaded', () => {
  // Select all elements with classes containing 'chai-'
  const elements = document.querySelectorAll('[class*="chai-"]');

  // Map utility keys to CSS properties
  const keyMap = {
    // Margin shortcuts (check longer variants first)
    'mt': 'margin-top',
    'mb': 'margin-bottom',
    'ml': 'margin-left',
    'mr': 'margin-right',
    'm': 'margin',
    // Padding shortcuts
    'pt': 'padding-top',
    'pb': 'padding-bottom',
    'pl': 'padding-left',
    'pr': 'padding-right',
    'p': 'padding',
    // Colors
    'bg': 'background-color',
    'text': 'color',
    // Typography
    'fs': 'font-size',
    'fw': 'font-weight',
    'align': 'text-align',
    // Layout
    'display': 'display',
    'w': 'width',
    'h': 'height',
    'rounded': 'border-radius',
    'shadow': 'box-shadow',
    'border': 'border',
    'gap': 'gap',
    'justify': 'justify-content',
    'items': 'align-items',
  };

  elements.forEach(element => {
    // Get all classes from the element
    const classes = element.className.split(' ');
    
    // Filter for chai-* classes
    const chaiClasses = classes.filter(cls => cls.startsWith('chai-'));

    chaiClasses.forEach(chaiClass => {
      // Remove 'chai-' prefix
      const content = chaiClass.slice(5);

      // Find the matching key by checking longest keys first
      const sortedKeys = Object.keys(keyMap).sort((a, b) => b.length - a.length);
      
      for (const key of sortedKeys) {
        if (content.startsWith(key + '-') || content === key) {
          const cssProperty = keyMap[key];
          
          // Extract the value part
          let value = '';
          if (content === key) {
            value = '';
          } else {
            value = content.slice(key.length + 1); // +1 for the hyphen
          }

          if (value) {
            // Process the value
            let finalValue = value;

            // Check if it's a pure number - if so, append 'px'
            if (/^\d+$/.test(value)) {
              finalValue = value + 'px';
            } else {
              // Replace hyphens with spaces for multi-part values
              // e.g., '2px-solid-blue' becomes '2px solid blue'
              finalValue = value.replace(/-/g, ' ');
            }

            // Convert CSS property name to camelCase for style object
            const camelCaseProperty = getCamelCaseProperty(cssProperty);
            element.style[camelCaseProperty] = finalValue;
          }

          break;
        }
      }

      // Remove the chai-* class from DOM for cleanup
      element.classList.remove(chaiClass);
    });
  });

  /**
   * Convert kebab-case CSS property names to camelCase
   * e.g., 'margin-top' -> 'marginTop'
   */
  function getCamelCaseProperty(property) {
    return property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }
});

module.exports = function postcssPrefixSelector(options) {
  const prefix = options.prefix;
  const prefixWithSpace = /\s+$/.test(prefix) ? prefix : `${prefix} `;
  const fileExcludeFileReg = options.excludeFileReg;

  return function (root, result) {
    // exclude file
    // @example  {excludeFileReg: /node_modules\/antd-mobile/}
    if (
      fileExcludeFileReg instanceof RegExp &&
      result.opts.from &&
      fileExcludeFileReg.test(result.opts.from)
    ) {
      console.log(
        'postcssPrefixSelector2 exclude file ===> ',
        result.opts.from
      );
      return;
    }

    root.walkRules((rule) => {
      const keyframeRules = [
        'keyframes',
        '-webkit-keyframes',
        '-moz-keyframes',
        '-o-keyframes',
      ];

      if (rule.parent && keyframeRules.includes(rule.parent.name)) {
        return;
      }

      rule.selectors = rule.selectors.map((selector) => {
        if (options.exclude && excludeSelector(selector, options.exclude)) {
          return selector;
        }

        if (options.transform) {
          return options.transform(
            prefix,
            selector,
            prefixWithSpace + selector
          );
        }

        return prefixWithSpace + selector;
      });
    });
  };
};

function excludeSelector(selector, excludeArr) {
  return excludeArr.some((excludeRule) => {
    if (excludeRule instanceof RegExp) {
      return excludeRule.test(selector);
    }

    return selector === excludeRule;
  });
}

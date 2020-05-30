module.exports = function(source) {
  const { content } = this.query;
  
  const constStr = '__REQUIRE_PACKAGES__';
  while(source.indexOf(constStr) >= 0) {
    source = 
      source.substr(0, source.indexOf(constStr)) +
      JSON.stringify(content) +
      source.substr(source.indexOf(constStr) + constStr.length);
  }

  return source;
};

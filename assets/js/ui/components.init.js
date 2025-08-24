(function(){
  if (typeof window === 'undefined') return;
  if (!window.UIComponents) {
    class UIComponents {}
    window.UIComponents = UIComponents;
  }
})();

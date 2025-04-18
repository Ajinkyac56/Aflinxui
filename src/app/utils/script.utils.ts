export function loadHeadScript(url: any, id: string) {
  const element = document.getElementById(id);
  element?.remove();
  let node = document.createElement('script');
  node.src = url;
  node.type = 'text/javascript';
  node.id = id;
  document.getElementsByTagName('head')[0].appendChild(node);
}

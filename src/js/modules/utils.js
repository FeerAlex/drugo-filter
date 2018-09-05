export function createFrag (templateId, data){
  let source = document.querySelector(templateId).innerHTML;
  let render = Handlebars.compile(source);
  let template = render(data);
  
  return document.createRange().createContextualFragment(template);
}

export function getElementUnderClientXY(elem, clientX, clientY) {
  let display = elem.style.display || "";
  elem.style.display = "none";

  let target = document.elementFromPoint(clientX, clientY);

  elem.style.display = display;

  if (!target || target === document) { // это бывает при выносе за границы окна
    target = document.body; // поправить значение, чтобы был именно элемент
  }

  return target;
}
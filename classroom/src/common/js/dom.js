export function hasClass(el, className) {
  return el.classList.contains(className);
}

export function addClass(el, className) {
  el.classList.add(className);
}

export function removeClass(el, className) {
  if (hasClass(el, className)) {
    el.classList.remove(className);
  }
}

export function getData(el, name, val) {
  const prefix = 'data-';
  if (val) {
    return el.setAttribute(prefix + name, val);
  }
  return el.getAttribute(prefix + name);
}

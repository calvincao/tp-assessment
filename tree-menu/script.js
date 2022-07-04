import list from './list.js';
/**
 * To display an arbitrarily nested object as list items on the page, we'll employ the use of a recursive function.
 * Restrictions on this algo: all values of entries must be objects
 * The algorithm can handle arbitrarily deep objects but if you want to limit how deep the nesting goes, define max in the function call
 * A depth variable, set to 1 by default, will keep count of the recursion depth
 * Once the depth has reached the supplied max, children objects will not be displayed.
 * Instead, a list item with the text 'and more...' will be shown to denote more items that aren't visible on the page
 * @param {object} tree
 * @param {HTMLElement} element
 * @param {number} max
 * @param {number} depth
 * @returns void
 */
const createTree = (tree, element, max, depth = 1) => {
  if (max && depth > max) {
    const li = document.createElement('li');
    li.innerText = 'And more...';
    li.classList.add('leaf');
    element.append(li);
    return;
  }
  for (const [key, val] of Object.entries(tree)) {
    const li = document.createElement('li');
    if (Object.values(val).length > 0) {
      const span = document.createElement('span');
      span.classList.add('arrow');
      span.innerText = key;
      li.append(span);
      const ul = document.createElement('ul');
      ul.classList.add('nested');
      li.append(ul);
      createTree(val, ul, max, depth + 1);
    } else {
      li.innerText = key;
      li.classList.add('leaf');
    }
    element.append(li);
  }
};
const fetchData = async (url) => {
  const res = await fetch(url);
  console.log(res);
  if (!res.ok) {
    document
      .querySelector('body')
      .append(`Error ${res.status}! Problem encountered while fetching data.`);
    throw Error(res.status);
  }
  const data = await res.json();
  createTree(data, document.querySelector('#root'), 10);
  for (const element of document.getElementsByClassName('arrow')) {
    element.addEventListener('click', (e) => {
      e.target.parentElement.querySelector('.nested').classList.toggle('active');
      e.target.classList.toggle('arrow-open');
    });
  }
};

// menu can be created either using local data or API call
fetchData('https://calvin-api.herokuapp.com/nested');

import select from 'select-dom';
import copy from 'copy-text-to-clipboard';

function onclick(evt) {
  const nbMR = evt.target.innerText.trim();
  const isSuccess = copy(
    `[${nbMR}](${window.location.origin}${
      window.location.pathname
    }/${nbMR.replace('!', '')})`
  );
  const elemtAdded = evt.target.appendChild(
    <div style={{ position: 'absolute', color: 'green' }}>
      {isSuccess ? 'Copied!' : 'Error!'}
    </div>
  );
  setTimeout(() => {
    evt.target.removeChild(elemtAdded);
  }, 2000);
}

export default function copyMR() {
  select.all('.issuable-reference').forEach(elem => {
    elem.setAttribute('data-original-title', 'Copy MR URL as MD link!');
    elem.className += ' has-tooltip';
    elem.style.textDecoration = 'underline';
    elem.style.fontWeight = 'bold';
    elem.style.cursor = 'pointer';
    elem.onclick = onclick;
  });
}

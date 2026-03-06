const inp = document.getElementById('inp');
const out = document.getElementById('out');
const box = document.getElementById('box');

inp.addEventListener('input', function () {
  const val = this.value;

  if (!val) {
    out.className = 'placeholder';
    out.textContent = 'Start typing…';
    box.classList.remove('active');
  } else {
    const reversed = val.split('').reverse().join('');
    out.className = 'result-text';
    out.textContent = reversed;
    box.classList.add('active');
  }
});